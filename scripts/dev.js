import { spawn } from 'node:child_process'
import process from 'node:process'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npmArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'npm run dev'] : ['run', 'dev']
const children = [
  spawn(process.platform === 'win32' ? process.env.ComSpec : npmCommand, npmArgs, {
    cwd: 'server',
    stdio: 'inherit',
  }),
  spawn(process.platform === 'win32' ? process.env.ComSpec : npmCommand, npmArgs, {
    cwd: 'client',
    stdio: 'inherit',
  }),
]

let stopping = false

const stop = (exitCode) => {
  if (stopping) {
    return
  }

  stopping = true
  for (const child of children) {
    if (!child.killed) {
      child.kill()
    }
  }
  process.exitCode = exitCode
}

for (const child of children) {
  child.on('error', () => stop(1))
  child.on('exit', (code) => {
    if (!stopping) {
      stop(code ?? 1)
    }
  })
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
