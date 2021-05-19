import { isPlatform, useIonAlert } from "@ionic/react";
import { useState } from "react";
import config from '../config.json'
import { BluetoothSerial } from '@ionic-native/bluetooth-serial'
import { useRanklist } from "./useRanklist";

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
  let [desc, setDesc] = useState(missions[missionIdx].desc)
  let [level, setLevel] = useState(missions[missionIdx].mission)
  let [balls, setBalls] = useState(0)
  let [isPlaying, setIsPlaying] = useState(false)
  const {addToRanklist} = useRanklist()
  
  console.log(seconds)
  const [present] = useIonAlert()
  
  let timer: number

  // let isPlaying: boolean = false
  if (isPlatform('hybrid')) {
    BluetoothSerial.connect('B8:08:CF:99:50:97').toPromise().then(console.log).then(() => {
      BluetoothSerial.subscribe('\n').toPromise().then(data => {
        // 投币
        // IO.1:0
        // IO.1:1
        // 进球
        // IO.2:0
        // IO.2:1
        // IO.3:0
        // IO.3:1
        console.log(data)
  
      })
    })
  }

  
  const showldGoNext = () => {
    return balls >= requirements
  }
  // todo：建立蓝牙通信
  
  const startMission = () => {
    // 传输gcode

    window.clearInterval(timer)
    timer = window.setInterval(() => {
      if (seconds <= 0 || showldGoNext()) {
        window.clearInterval(timer)
        
        if (showldGoNext()) {
          if (missionIdx >= missions.length - 1) {
            // 通关并进入排行榜、提示闯关成功
            present({
              cssClass: 'my-css',
              header: '提示',
              message: '恭喜你，进入排行榜',
              inputs: [
                {
                  name: 'name',
                  type: 'text',
                  placeholder: '请输入ID'
                }
              ],
              buttons: [
                { text: '确定', handler: (d) => {
                  console.log(d)
                  addToRanklist({
                    username: d.name,
                    balls: balls
                  })
                  resetGame() 
                }},
              ],
              onDidDismiss: (e) => console.log(e),
            })
          } else {
            // 进入下一关
            missionIdx++
            present({
              cssClass: 'my-css',
              header: '提示',
              message: '恭喜你，成功进入下一关',
              buttons: [
                { text: '继续', handler: (d) => {
                  balls = missions[missionIdx].requirements + 1
                  setBalls(balls)
                  setSeconds(missions[missionIdx].seconds)
                  setRequirements(missions[missionIdx].requirements)
                  setDesc(missions[missionIdx].desc)
                  setLevel(missions[missionIdx].mission)
                  startGameAlert(startMission)
                }},
              ],
              onDidDismiss: (e) => console.log('did dismiss'),
            })
          }
        } else {
          // 提示重新再来
          endMission()
        }
      } else {
        seconds--
        setSeconds(seconds)
      }
    }, 1000)
  }
  const resetGame = () => {
    missionIdx = 0
    setIsPlaying(false)
    setBalls(0)
    setSeconds(missions[missionIdx].seconds)
    setRequirements(missions[missionIdx].requirements)
    setDesc(missions[missionIdx].desc)
    setLevel(missions[missionIdx].mission)
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
    balls = missions[missionIdx].requirements + 1
    setBalls(balls)
    setSeconds(missions[missionIdx].seconds)
    setRequirements(missions[missionIdx].requirements)
    setDesc(missions[missionIdx].desc)
    setLevel(missions[missionIdx].mission)

    startMission()
  }

  let [showAlert, setShowAlert] = useState(false)
  let [message, setMessage] = useState('')

  let timer1: number

  const startGameAlert = (callback: Function | void) => {
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
        if (!callback) {
          startGame()
        } else {
          callback()
        }
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
    desc,
    level,
    balls,
    isPlaying,
    startGameAlert
  }
}