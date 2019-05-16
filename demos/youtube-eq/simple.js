const context = new AudioContext();

const filterFrequencies = [100, 250, 500, 750, 1000, 2000, 4000, 8000]
const dynamicRange = 40

const filters = filterFrequencies.map((f, i) => {
  const filter = context.createBiquadFilter()
  filter.type = i < filterFrequencies.length - 1 ? 'peaking' : 'highshelf'
  filter.frequency.value = f
  filter.Q.value = 4
  return filter
})

const video = document.querySelector('video')
const source = context.createMediaElementSource(video);

source.connect(filters[0])

filters.forEach((filter, i) => {
  if (filters[i + 1]) filter.connect(filters[i + 1])
  else filter.connect(context.destination)
});

(async function main() {
  const access = await navigator.requestMIDIAccess()

  for (let input of access.inputs.values()) {
    input.onmidimessage = ({ data: [status, channel, value] }) => {
      if (status != 176 || !filters[channel]) return

      const filterValue = value * dynamicRange / 127 - dynamicRange / 2
      console.log(`${filterFrequencies[channel]} Hz: ${filterValue.toFixed(1)} dB`)

      filters[channel].gain.value = filterValue
    }
  }  
})()
