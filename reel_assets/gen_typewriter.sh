#!/bin/bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
set -e

cd "/c/Users/39389/cinzia-coaching/reel_assets"
mkdir -p captions/tw

# beat definitions: name|text|start|end|color|mode(type|whole)
BEATS=(
  "b1|LA FORZA|0.0|4.5|white|type"
  "b2|NON È UN TALENTO.|4.5|6.3|0x5EDCD6|type"
  "b3|È UNA SCELTA.|6.3|7.9|white|type"
  "b4|CHE SI ALLENA,|7.9|9.7|0x5EDCD6|type"
  "b5|GIORNO|9.7|10.9|white|type"
  "b6|DOPO GIORNO.|10.9|12.3|0x5EDCD6|type"
  "b7|ED È SEMPRE STATA|12.3|13.9|white|type"
  "b8|ED È SEMPRE STATA... TUA!|13.9|15.3|0x5EDCD6|whole"
)

STEP=0.07
FONT="fonts/Oswald-Variable.ttf"
OUT="filtergraph_typewriter.txt"
> "$OUT"

PREV="graded"
for entry in "${BEATS[@]}"; do
  IFS='|' read -r name text start end color mode <<< "$entry"
  N=${#text}
  if [ "$mode" == "type" ]; then
    steps=$(( (N + 1) / 2 ))
    for k in $(seq 1 $steps); do
      len=$(( k * 2 ))
      if [ $len -gt $N ]; then len=$N; fi
      sub="${text:0:$len}"
      fname="captions/tw/${name}_${k}.txt"
      printf '%s' "$sub" > "$fname"
      t0=$(awk -v s="$start" -v k="$k" -v st="$STEP" 'BEGIN{printf "%.4f", s+(k-1)*st}')
      t1=$(awk -v s="$start" -v k="$k" -v st="$STEP" 'BEGIN{printf "%.4f", s+k*st}')
      label="tw_${name}_${k}"
      echo "[${PREV}]drawtext=fontfile=${FONT}:textfile=${fname}:fontcolor=${color}:fontsize=88:borderw=3:bordercolor=black@0.6:x=(w-text_w)/2:y=1120:enable='between(t,${t0},${t1})':alpha=1[${label}];" >> "$OUT"
      PREV="$label"
    done
    fullfile="captions/tw/${name}_full.txt"
    printf '%s' "$text" > "$fullfile"
    reveal_end=$(awk -v s="$start" -v st="$steps" -v sp="$STEP" 'BEGIN{printf "%.4f", s+st*sp}')
    fo_start=$(awk -v e="$end" 'BEGIN{printf "%.4f", e-0.12}')
    label="hold_${name}"
    echo "[${PREV}]drawtext=fontfile=${FONT}:textfile=${fullfile}:fontcolor=${color}:fontsize=88:borderw=3:bordercolor=black@0.6:x=(w-text_w)/2:y=1120:enable='between(t,${reveal_end},${end})':alpha='if(gt(t,${fo_start}),(${end}-t)/0.12,1)'[${label}];" >> "$OUT"
    PREV="$label"
  else
    fullfile="captions/tw/${name}_full.txt"
    printf '%s' "$text" > "$fullfile"
    fi_end=$(awk -v s="$start" 'BEGIN{printf "%.4f", s+0.35}')
    fo_start=$(awk -v e="$end" 'BEGIN{printf "%.4f", e-0.12}')
    label="whole_${name}"
    echo "[${PREV}]drawtext=fontfile=${FONT}:textfile=${fullfile}:fontcolor=${color}:fontsize=80:borderw=3:bordercolor=black@0.6:x=(w-text_w)/2:y=1120:enable='between(t,${start},${end})':alpha='if(lt(t,${fi_end}),(t-${start})/0.35,if(gt(t,${fo_start}),(${end}-t)/0.12,1))'[${label}];" >> "$OUT"
    PREV="$label"
  fi
done

echo "LAST_LABEL=${PREV}"
wc -l "$OUT"
