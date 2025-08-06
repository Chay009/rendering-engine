# Global Audio Orchestration - Comprehensive Test Suite 🎵

## Overview
This directory contains **10 comprehensive test cases** that demonstrate every aspect of the Global Audio Orchestration system. Each test focuses on a specific feature or combination of features.

## Test Case Descriptions

### 1. **Mode: ALL Components Sync** (`01-mode-all-components-sync.json`)
- **Purpose**: Test global mode "all" where every component syncs with audio
- **Components**: TitleCard, CountdownTimer, ImageWithZoom (all sync)
- **Expected**: All 3 components react to audio with scaling, glow, and opacity effects
- **Audio Config**: `mode: "all", defaultReactivity: 1.2, masterIntensity: 0.9`

### 2. **Mode: SELECTIVE Components** (`02-mode-selective-choose-components.json`) 
- **Purpose**: Test selective component syncing via syncComponents whitelist
- **Components**: TitleCard ✅, CountdownTimer ✅, ImageWithZoom ❌ (excluded)
- **Expected**: Only TitleCard and CountdownTimer react, ImageWithZoom stays static
- **Audio Config**: `mode: "selective", syncComponents: ["TitleCard", "CountdownTimer"]`

### 3. **Mode: ALL with Exclusions** (`03-mode-all-with-exclusions.json`)
- **Purpose**: Test exclusion blacklist with excludeComponents array
- **Components**: TitleCard ✅, CountdownTimer ✅, ImageWithZoom ❌ (excluded)
- **Expected**: All components sync EXCEPT ImageWithZoom (blacklisted)
- **Audio Config**: `mode: "all", excludeComponents: ["ImageWithZoom"]`

### 4. **Mode: MANUAL Explicit Opt-in** (`04-mode-manual-explicit-optin.json`)
- **Purpose**: Test manual mode where only components with audioSync props work
- **Components**: TitleCard ❌, CountdownTimer ✅ (has audioSync), ImageWithZoom ❌
- **Expected**: Only CountdownTimer reacts (explicit audioSync prop)
- **Audio Config**: `mode: "manual"`

### 5. **Mode: NONE Audio Disabled** (`05-mode-none-audio-disabled.json`)
- **Purpose**: Test complete audio sync disable, background music only
- **Components**: All components static (no audio reactions)
- **Expected**: Audio plays but no visual reactions, all components use original animations only
- **Audio Config**: `mode: "none"`

### 6. **Component Override Tests** (`06-component-overrides-custom-sync.json`)
- **Purpose**: Test component-level overrides with different sync types
- **Components**: TitleCard (bass), CountdownTimer (highs), ImageWithZoom (overall)
- **Expected**: Each component reacts to different frequency bands
- **Audio Config**: Each component has custom `audioSync` with different types

### 7. **Beat Detection Showcase** (`07-beat-detection-showcase.json`)
- **Purpose**: Highlight beat detection with all components using type: "beat"
- **Components**: All components configured for beat detection
- **Expected**: Coordinated pulsing/glowing on drum hits and percussion
- **Audio Config**: All components set to `type: "beat"` with high reactivity

### 8. **Frequency Bands Demo** (`08-frequency-bands-demo.json`)
- **Purpose**: Demonstrate different frequency band reactions
- **Components**: Bass (TitleCard), Mids (CountdownTimer), Highs (ImageWithZoom)
- **Expected**: Different reactions based on music elements (bass line, vocals, treble)
- **Audio Config**: Each component targets specific frequency ranges

### 9. **Reactivity Levels Comparison** (`09-reactivity-levels-comparison.json`)
- **Purpose**: Compare different reactivity levels (0.5, 1.0, 2.0)
- **Components**: Low (0.5), Medium (1.0), High (2.0) reactivity
- **Expected**: Subtle, normal, and intense reactions to same audio
- **Audio Config**: Same sync type, different reactivity values

### 10. **Master Intensity Control** (`10-master-intensity-control.json`)
- **Purpose**: Test master intensity scaling at 30% (0.3)
- **Components**: All components with high reactivity but reduced by master control
- **Expected**: Subdued audio effects despite high component reactivity settings
- **Audio Config**: `masterIntensity: 0.3` reduces all effects globally

## Testing Instructions

### Automated Testing
```bash
# Test all cases sequentially
cd remotion-rendering-engine
for i in {01..10}; do
  echo "Testing case $i..."
  curl -X POST http://localhost:3000/renders -H "Content-Type: application/json" -d @examples/audio-tests/${i}*.json
  sleep 15  # Wait for render to complete
done
```

### Manual Testing via Web Interface
1. Open `http://localhost:3000` in browser
2. Load each test JSON file 
3. Click "Render Video"
4. Download and play in VLC Media Player
5. Observe audio-reactive behaviors

### Expected Behaviors Summary

| Test Case | TitleCard Reacts | CountdownTimer Reacts | ImageWithZoom Reacts | Audio Sync Type |
|-----------|------------------|----------------------|---------------------|-----------------|
| 01 - All | ✅ | ✅ | ✅ | Global default |
| 02 - Selective | ✅ | ✅ | ❌ | Whitelist |
| 03 - Exclude | ✅ | ✅ | ❌ | Blacklist |
| 04 - Manual | ❌ | ✅ | ❌ | Explicit opt-in |
| 05 - None | ❌ | ❌ | ❌ | Disabled |
| 06 - Override | ✅ (bass) | ✅ (highs) | ✅ (overall) | Custom types |
| 07 - Beats | ✅ (beat) | ✅ (beat) | ✅ (beat) | Beat detection |
| 08 - Frequency | ✅ (bass) | ✅ (mids) | ✅ (highs) | Frequency bands |
| 09 - Reactivity | ✅ (0.5x) | ✅ (1.0x) | ✅ (2.0x) | Intensity levels |
| 10 - Master | ✅ (30%) | ✅ (30%) | ✅ (30%) | Global scaling |

## Audio Effects to Observe

### TitleCard Effects
- **Scale**: Text scaling 1.0x to 1.3x based on audio
- **Opacity**: Slight fading with audio activity  
- **Glow**: Text shadow appears on beat detection
- **Original**: Maintains fadeIn/slideUp/scale animations

### CountdownTimer Effects  
- **Scale**: Enhanced pulse scaling with audio
- **Opacity**: Opacity variations with audio levels
- **Glow**: Shadow effects on beat detection
- **Original**: Maintains existing countdown pulse

### ImageWithZoom Effects
- **Scale**: Audio-enhanced zoom scaling
- **Brightness**: Image brightness boost on beats
- **Saturation**: Color saturation increase on beats  
- **Original**: Maintains zoom in/out animations

## Performance Testing
- **Load Time**: Single audio analysis shared across all components
- **Memory**: No duplicate audio loading
- **CPU**: Efficient frequency analysis with 32-band spectrum
- **Rendering**: Should maintain 30fps with audio sync enabled

## Validation Checklist

✅ **Architecture Validation**
- [ ] GlobalAudioProvider wraps DynamicVideo correctly
- [ ] useAudioEnhancedProps hook functions in all components
- [ ] Audio analysis shared efficiently across components
- [ ] Component-level overrides work as expected

✅ **Feature Validation**  
- [ ] All 4 global modes work correctly (all, selective, none, manual)
- [ ] Include/exclude component lists function properly
- [ ] 5 sync types work (beat, bass, mids, highs, overall)
- [ ] Reactivity levels scale effects appropriately
- [ ] Master intensity controls all effects globally

✅ **Compatibility Validation**
- [ ] Existing videos without audio config still work
- [ ] Components maintain original animations
- [ ] Audio disabled gracefully when no audio provided
- [ ] Error handling for invalid audio URLs

## Troubleshooting

**No Audio Effects Visible:**
- Check `globalSync.enabled: true`
- Verify component is in `syncComponents` array (selective mode)
- Ensure component not in `excludeComponents` array
- Check `masterIntensity` > 0

**Audio Not Playing:**
- Use VLC Media Player (default players may not support audio)
- Check `audioUrl` path is correct
- Verify audio file exists in `public/` folder
- Check browser console for CORS errors

**Performance Issues:**
- Reduce `defaultReactivity` values
- Lower `masterIntensity` 
- Use fewer simultaneously active components
- Check CPU usage during rendering

This comprehensive test suite validates every aspect of the Global Audio Orchestration system! 🎵✅