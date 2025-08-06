# Audio Integration in JSON Requests

## Method 1: Background Audio (Type 1)

Add `audioConfig` to your video request for background audio:

```json
{
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "timeline": [
    {
      "component": "TitleCard",
      "props": {
        "text": "Welcome to the Show",
        "color": "#FFFFFF"
      },
      "startFrame": 0,
      "durationInFrames": 90
    }
  ],
  "audioConfig": {
    "audioUrl": "sample-music.mp3",
    "volume": 0.8,
    "fadeIn": 2,
    "fadeOut": 3,
    "loop": true
  }
}
```

## Method 2: Audio-Synced Components (Type 2)

Use audio-reactive components in your timeline:

```json
{
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "timeline": [
    {
      "component": "AudioSyncedText",
      "props": {
        "text": "FEEL THE BEAT",
        "audioUrl": "sample-music.mp3",
        "baseSize": 72,
        "color": "#FF6347",
        "syncType": "bass",
        "reactivity": 1.5,
        "glowEffect": true
      },
      "startFrame": 0,
      "durationInFrames": 180
    },
    {
      "component": "BeatReactiveShape",
      "props": {
        "audioUrl": "sample-music.mp3",
        "shape": "circle",
        "baseColor": "#333333",
        "beatColor": "#00FFFF",
        "size": 150,
        "reactivity": 2
      },
      "startFrame": 30,
      "durationInFrames": 150
    }
  ]
}
```

## Method 3: Combined Background + Reactive

```json
{
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "timeline": [
    {
      "component": "AudioSyncedText",
      "props": {
        "text": "MUSIC VISUALIZATION",
        "audioUrl": "sample-music.mp3",
        "syncType": "overall",
        "baseSize": 48,
        "color": "#FFFFFF",
        "reactivity": 1.5
      },
      "startFrame": 0,
      "durationInFrames": 300
    },
    {
      "component": "BeatReactiveShape",
      "props": {
        "audioUrl": "sample-music.mp3",
        "shape": "circle",
        "beatColor": "#FF4444",
        "size": 120,
        "reactivity": 1.8
      },
      "startFrame": 0,
      "durationInFrames": 300
    }
  ],
  "audioConfig": {
    "audioUrl": "sample-music.mp3",
    "volume": 0.7,
    "loop": true
  }
}
```

## Audio File References

### For Local Files (Recommended)
```json
{
  "audioUrl": "sample-music.mp3"
}
```
*File should be in `public/sample-music.mp3`*

### For Hosted Files
```json
{
  "audioUrl": "https://your-cdn.com/audio/track.mp3"
}
```
*Ensure CORS headers are properly configured*

## Audio Component Props

### AudioPlayer (Background Audio)
```json
{
  "audioUrl": "filename.mp3",
  "volume": 0.8,
  "startTime": 0,
  "fadeIn": 2,
  "fadeOut": 3,
  "loop": true
}
```

### BeatReactiveShape
```json
{
  "audioUrl": "filename.mp3",
  "baseColor": "#333333",
  "beatColor": "#FF6347",
  "shape": "circle",
  "size": 150,
  "reactivity": 2
}
```

### AudioSyncedText
```json
{
  "text": "REACTIVE TEXT",
  "audioUrl": "filename.mp3",
  "baseSize": 48,
  "color": "#FFFFFF",
  "syncType": "bass",
  "reactivity": 1.5,
  "glowEffect": true
}
```

## Sync Types for Audio-Reactive Components

- `"bass"` - Reacts to low frequencies (drums, bass)
- `"mids"` - Reacts to mid frequencies (vocals, guitar)
- `"highs"` - Reacts to high frequencies (cymbals, synths)
- `"overall"` - Reacts to overall audio level

## Shape Options

- `"circle"` - Circular shape
- `"square"` - Square shape  
- `"triangle"` - Triangle shape

## Example: Music Video Timeline

```json
{
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "timeline": [
    {
      "component": "AudioSyncedText",
      "props": {
        "text": "BASS DROP",
        "audioUrl": "edm-track.mp3",
        "syncType": "bass",
        "baseSize": 96,
        "color": "#FF0080",
        "glowEffect": true,
        "reactivity": 3
      },
      "startFrame": 0,
      "durationInFrames": 120
    },
    {
      "component": "BeatReactiveShape",
      "props": {
        "audioUrl": "edm-track.mp3",
        "shape": "circle",
        "baseColor": "#1a1a1a",
        "beatColor": "#00FFFF",
        "size": 200,
        "reactivity": 2.5
      },
      "startFrame": 30,
      "durationInFrames": 90
    }
  ],
  "audioConfig": {
    "audioUrl": "edm-track.mp3",
    "volume": 0.9,
    "loop": false
  }
}
```

This creates a music visualization with text that reacts to bass frequencies and a shape that pulses with the beat, all synchronized to the same audio track!

## ✅ Testing Your Audio

**IMPORTANT**: Always test rendered videos in **VLC Media Player**. Some default media players (like Windows default player) may not properly play audio from Remotion-generated videos.

### Confirmed Working:
- Audio properly embeds in MP4 files ✅
- Both background audio and audio-reactive components work ✅
- JSON API correctly processes audio URLs ✅
- staticFile() conversion works automatically ✅

**Your audio integration is working correctly!** 🎵