# Tema Reel — Cinzia Rosato Coaching

Documento di riferimento per ricreare reel futuri con lo stesso formato visivo. In futuro basta fornire nuovi video/foto e nuovi testi: la struttura tecnica sotto va riapplicata identica.

> **Trigger d'uso**: quando l'utente chiede un nuovo reel/video per il coaching di Cinzia Rosato (anche solo "fammi un reel con questi video/foto e questo testo"), applicare SEMPRE questo tema — stessa cornice a doppia fascia, stesso logo/posizione, stessi font/colori, stesso effetto macchina da scrivere — senza doverlo richiedere esplicitamente. Cambiano solo contenuti (video/foto) e testi.

## Specifiche generali

- **Formato output**: 1080×1920 (9:16, verticale, Instagram Reels)
- **Frame rate**: 30 fps
- **Codec**: H.264, `-crf 19 -preset medium`
- **Pixel format**: `yuv420p`, range **tv** (limitato) esplicito — vedi nota colore sotto
- **Colore/matrice**: `-color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709` sempre espliciti in output, altrimenti rischio di shift colore (vedi "Trappole" sotto)
- **Font**: `Oswald-Variable.ttf` (scaricato da Google Fonts, salvato in `reel_assets/fonts/`)
- **Palette testo**: bianco (`white`) e teal chiaro (`0x5EDCD6`) **alternati** riga per riga; accento teal principale del sito per enfasi speciali: `0x0FB8B0`
- **Colore di sfondo del sito (fondamentale)**: `0x050D11` — usare SEMPRE questo per qualunque sfondo/cornice, mai un colore "campionato" o approssimato

## Cornice / bordo fisso (il "tema" logo)

Il video è racchiuso tra **due fasce fisse** color sito (`0x050D11`), che restano identiche in ogni reel:

- **Fascia superiore**: 220px di altezza, contiene il logo
- **Fascia inferiore**: 220px di altezza, colore pieno senza contenuto
- **Area video interna**: 1080×1480 (1920 − 220 − 220)
- **Logo**: file `img/logo_nosfondo.png` (ha trasparenza alpha reale integrata — **non serve alcun trucco di blend/keying**, va semplicemente sovrapposto con `overlay` preservando il canale alpha)
  - Scalato a **340px di larghezza** (~198px altezza)
  - Centrato orizzontalmente nella fascia superiore
  - Posizione verticale: centrato nei 220px della fascia (`y = (220-198)/2 ≈ 11`)

**Filtro esatto per la fascia superiore con logo:**
```
[logo]format=rgba,scale=340:-1[logoscaled];
[topbar_bg]format=yuv420p,fps=30[topbar_bg2];
[topbar_bg2][logoscaled]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:format=auto,format=yuv420p[topbar];
```

Poi si assembla con `vstack`: `[topbar][video_interno_1080x1480][bottombar]` → 1080×1920.

## Video/foto interni

- Ogni clip/foto va scalata con `scale=1080:1480:force_original_aspect_ratio=increase,crop=1080:1480` (copre e ritaglia al centro, funziona con qualsiasi proporzione sorgente)
- Color grading uniforme su tutto il concatenato:
  ```
  eq=contrast=1.08:saturation=1.15:brightness=0.01,
  colorbalance=rs=-0.06:gs=0.02:bs=0.10:rm=-0.03:gm=0.0:bm=0.05,
  vignette=PI/6,
  noise=alls=8:allf=t+u
  ```

## Testo: effetto macchina da scrivere

- Le scritte principali (corpo video) appaiono **lettera per lettera** (2 caratteri per scatto, 0.07s per scatto — non 1 carattere a scatto, per contenere il numero di filtri)
- Font size corpo: 88px, bordo nero sottile (`borderw=3:bordercolor=black@0.6`) per leggibilità su ogni sfondo
- Posizione verticale testo corpo: `y=1120` (dentro il canvas interno 1080×1480)
- Dopo la rivelazione completa, il testo resta fermo e sfuma negli ultimi 0.12s prima del taglio successivo
- Frasi conclusive/di forte enfasi (es. payoff finale prima dell'outro) possono apparire **intere** (non a macchina da scrivere) con un fade-in di 0.35s — usare quando serve un "colpo" retorico

Script di generazione: `reel_assets/gen_typewriter.sh` — genera automaticamente tutti i file di sottostringa e le righe `drawtext` per ogni beat, dati testo/colore/inizio/fine.

## Struttura outro (schermata finale)

- Sfondo pieno colore sito (`0x050D11`), durata 6.4s
- Logo grande: 680px larghezza, **fade-in reale sul canale alpha** (`fade=t=in:st=0:d=2.5:alpha=1`) — dissolvenza pulita, nessun trucco di colore necessario
- Posizionato a `y=350` circa (lascia spazio sopra e sotto)
- Tagline (es. "Scegliti. Costruisci. Diventa la tua forza.") in 3 righe, che appaiono in sequenza (~0.4s di ritardo tra una e l'altra), poi CTA finale ("Il sito è online" + "Visita il sito — link in bio")
- Testi distribuiti su tutta l'altezza disponibile per non lasciare spazio vuoto eccessivo

## Trappole tecniche da NON ripetere

1. **MAI usare `blend=all_mode=screen` per finte trasparenze** — il logo ha già alpha reale, va solo preservato con `format=rgba` e sovrapposto con `overlay` normale. Il blend su YUV grezzo produce shift di colore magenta.
2. **MAI convertire rgb24→yuv420p senza specificare range/matrice** — causa lo stesso tipo di shift colore. Se capita di dover convertire, usare `scale=out_range=tv:out_color_matrix=bt709,format=yuv420p`.
3. **Il filtro `concat` con grafi molto complessi (90+ filtri) può rompersi silenziosamente** (durata sbagliata, un pezzo che sparisce) anche senza errori espliciti. Soluzione robusta: **renderizzare corpo video e outro come DUE FILE SEPARATI**, poi unirli con il concat **demuxer** (`ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4`) — richiede stessi pix_fmt/color_range/fps nei due file.
4. **`xfade` tra un'immagine loopata e un video richiede `settb=1/30` esplicito su entrambi i lati** prima del filtro, altrimenti errore di timebase mismatch.
5. Foto statiche in input richiedono sempre `-loop 1 -t <durata>` esplicito, altrimenti durano solo 1 frame.
6. Font Oswald è variabile (`Oswald[wght].ttf`) — ffmpeg lo renderizza al peso Regular di default; sufficientemente leggibile in maiuscolo condensato, non serve cercare il peso Bold statico (link diretti Google Fonts scadono in fretta).

## File di riferimento in `reel_assets/`

- `filtergraph_header.txt` — scaling/crop/grading dei segmenti video + eventuale intro speciale (es. sfocatura crescente)
- `gen_typewriter.sh` — genera `filtergraph_typewriter.txt` dai beat definiti
- `fg_border_footer.txt` — cornice con logo (mainbody)
- `fg_outro.txt` — schermata finale
- `concat_list.txt` — lista per il concat demuxer finale

## Come rifare un reel con nuovi contenuti

1. Copiare i nuovi video/foto in `img/`
2. Aggiornare gli input e i `trim` in `filtergraph_header.txt` con i nuovi file/durate
3. Modificare l'array `BEATS` in `gen_typewriter.sh` con i nuovi testi/tempi/colori (alternare bianco/teal)
4. Rigenerare: `bash gen_typewriter.sh`
5. Renderizzare mainbody e outro separatamente, poi unire con il concat demuxer (vedi trappola #3)
6. Verificare sempre con `ffprobe -show_entries format=duration` che la durata finale sia quella attesa prima di consegnare
