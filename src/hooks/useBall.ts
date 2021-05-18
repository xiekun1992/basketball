import { useIonAlert } from "@ionic/react";
import { useState } from "react";
import config from '../config.json'

interface Mission {
  mission: number
  seconds: number,
  requirements: number,
  interval: number,
  speed: number,
  gcode: string,
  desc: string
}

export function useBall() {
  const [missions] = useState(config as Mission[])
  let missionIdx: number = 0 // 0 第一关
  console.log(missions)
  
  let [seconds, setSeconds] = useState(missions[missionIdx].seconds)
  let [requirements, setRequirements] = useState(missions[missionIdx].requirements)
  let [balls, setBalls] = useState(0)
  let [isPlaying, setIsPlaying] = useState(false)
  
  console.log(seconds)
  const [present] = useIonAlert()
  
  let timer: number

  // let isPlaying: boolean = false

  
  const showldGoNext = () => {
    return balls >= requirements
  }
  // todo：建立蓝牙通信
  
  const startMission = () => {
    // 传输gcode
  }
  const resetGame = () => {
    missionIdx = 0
    setIsPlaying(false)
    setBalls(0)
    setSeconds(missions[missionIdx].seconds)
    setRequirements(missions[missionIdx].requirements)
  }
  const endMission = () => {
    // 停止gcode传输和进球更新

    present({
      cssClass: 'my-css',
      header: '提示',
      message: '很遗憾，通关失败',
      buttons: [
        { text: '确定', handler: (d) => resetGame() },
      ],
      onDidDismiss: (e) => console.log('did dismiss'),
    })
  }
  const startGame = () => {
    if (isPlaying) {
      return
    }
    setIsPlaying(true)
    window.clearInterval(timer)
    timer = window.setInterval(() => {
      if (seconds <= 0 || showldGoNext()) {
        window.clearInterval(timer)
        endMission()
        
        if (showldGoNext()) {
          if (missionIdx >= missions.length - 1) {
            // 通关并进入排行榜、提示闯关成功
            
          } else {
            // 进入下一关
            missionIdx++
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

  let [showAlert, setShowAlert] = useState(false)
  let [message, setMessage] = useState('')

  let timer1: number

  const startGameAlert = () => {
    setShowAlert(true)
    let counter = 3
    // setCounter(counter)
    setMessage(counter.toString())
    clearInterval(timer1)
    timer1 = window.setInterval(() => {
      if (counter <= 0) {
        counter = 0
        setMessage(counter.toString())
        setShowAlert(false)
        startGame()
        clearInterval(timer1)
      } else {
        --counter
        console.log(counter.toString())
        setMessage(counter.toString())
      }
    }, 1000)
  }

  return {
    showAlert,
    message,
    seconds,
    requirements,
    desc: missions[missionIdx].desc,
    mission: missions[missionIdx].mission,
    balls,
    isPlaying,
    startGameAlert
  }
}