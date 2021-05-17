import { useState } from "react";

export function useBall() {
  let [seconds, setSeconds] = useState(30)
  const [requirements] = useState(20)
  const [missions] = useState([])
  let [ranklist, setRanklist] = useState<Ranklist[]>([])
  let [balls, setBalls] = useState(0)
  let timeout: number
  let mission: number = 0 // 0 第一关

  let isPlaying: boolean = false

  const showldGoNext = () => {
    return balls >= requirements
  }
  // todo：建立蓝牙通信

  const startMission = () => {
    // 传输gcode
  }
  const endMission = () => {
    // 停止gcode传输和进球更新
  }
  const startGame = () => {
    window.clearInterval(timeout)
    timeout = window.setInterval(() => {
      if (seconds <= 0 || showldGoNext()) {
        window.clearInterval(timeout)
        endMission()
        
        if (showldGoNext()) {
          if (mission >= missions.length - 1) {
            // 通关并进入排行榜、提示闯关成功
            
          } else {
            // 进入下一关
            mission++
            startMission()
          }
        } else {
          // 提示重新再来
        }
      } else {
        seconds--
        setSeconds(seconds)
      }
    }, 1000)
  }

  return {
    seconds,
    requirements,
    startGame
  }
}

interface Ranklist {
  username: string
  balls: number
}