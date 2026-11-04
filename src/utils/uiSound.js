const sounds = {
  step: '/audio/ui-step.wav',
  start: '/audio/ui-complete.wav',
  complete: '/audio/ui-complete.wav',
}

const players = new Map()

/** Reproduz feedback curto da interface com arquivos locais licenciados CC0. */
export function playUiSound(name) {
  if (typeof window === 'undefined' || !sounds[name]) return

  try {
    let player = players.get(name)
    if (!player) {
      player = new Audio(sounds[name])
      player.preload = 'auto'
      player.volume = 0.2
      players.set(name, player)
    }

    player.currentTime = 0
    const playback = player.play()
    playback?.catch(() => {})
  } catch {
    // O áudio é complementar; falhas de reprodução não interrompem o atendimento.
  }
}
