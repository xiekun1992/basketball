/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

let ballQueue = []
let coinQueue = []
let btnQueue = []
// let coinInserted = false

const game = [
{
    "id": 1,
    "time": 30,
    "balls": 3,
    "interval": 1000,
    "speed": 1200,
    "gcode": [
        // 'G90\r\n',
        // 'G0 X20 Z320 F6000\r\n',
        
        'G0 X170 Z320 F6000\r\n',
        
        // 'G0 X20 Z320 F6000\r\n',
        // 'G90\r\n'
    ],
    "desc": "篮框不动"
},
{
    "id": 2,
    "time": 30,
    "balls": 6,
    "interval": 1000,
    "speed": 1200,
    "gcode": [
        // 'G90\r\n',
        // 'G0 X20 Z320 F6000\r\n',
        
        'G0 X320 Z320 F6000\r\n',
        'G0 X20 Z320 F6000\r\n',
        'G0 X320 Z320 F6000\r\n',
        'G0 X20 Z320 F6000\r\n',
        'G0 X320 Z320 F6000\r\n',
        'G0 X20 Z320 F6000\r\n',
        'G0 X320 Z320 F6000\r\n',
        'G0 X20 Z320 F6000\r\n',
        
        // 'G0 X20 Z320 F6000\r\n',
        // 'G90\r\n'
    ],
    "desc": "篮框左右移动"
},
{
    "id": 3,
    "time": 30,
    "balls": 9,
    "interval": 1000,
    "speed": 1200,
    "gcode": [
        // 'G90',
        // 'G0 X20 Z320 F6000',
        
        // 'G0 X20 Z320 F6000\r\n',
        'G0 X170 Z200 F6000\r\n',
        'G0 X320 Z320 F6000\r\n',
        

        'G0 X20 Z320 F6000\r\n',
        'G0 X170 Z200 F6000\r\n',
        'G0 X320 Z320 F6000\r\n',

        'G0 X20 Z320 F6000\r\n',
        'G0 X170 Z200 F6000\r\n',
        'G0 X320 Z320 F6000\r\n',

        'G0 X20 Z320 F6000\r\n',
        // 'G0 X170 Z200 F6000\r\n',
        // 'G0 X320 Z320 F6000\r\n',

        // 'G0 X20 Z320 F6000\r\n',
        // 'G0 X170 Z200 F6000\r\n',
        // 'G0 X320 Z320 F6000\r\n',
        // 'G0 X20 Z320 F6000',
        // 'G90',
    ],
    "desc": "篮框上下左右移动"
}
]

let scores = 0
let isPlaying = false
let currentGameIdx = 0
let gameTimer = 0
let timer
let ranklist = []

// onDeviceReady()
function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    const rlStr = localStorage.getItem('ranklist')
    if (rlStr) {
        ranklist = JSON.parse(rlStr)
        renderRanklist()
    } else {
        updateRanklist()
    }
    resetGame()
    startEl.onclick = startCallback
    endEl.onclick = function() {
        resetGame()
    }
    
    connectBluetooth()
}
function startCallback() {
    if (!isPlaying) {
        // 倒计时并开始游戏
        // alert('投币成功，准备开始')
        isPlaying = true
        startEl.disabled = true
        // scores = 100
        counterEl.innerText = scores
        startGameAlert()
    }
}
function startGameAlert() {
    if (typeof bluetoothSerial !== 'undefined') {
        bluetoothSerial.write('gcode G90\r\ngcode G0 X20 Z320 F6000\r\n')
    }
    audioCoinEl.pause()
    audioCoinEl.currentTime = 0
    audioReadyEl.currentTime = 0
    audioReadyEl.play()
    counterPage.style.zIndex = 10
    let counter = 3
    readyEl.innerText = counter
    const t = setInterval(function() {
        if (counter <= 0) {
            counterPage.style.zIndex = -1
            clearInterval(t)
            startGame()
        } else {
            counter--
            readyEl.innerText = counter
        }
    }, 1000)
}
function startGame() {
    audioGameStartEl.play()
    clearInterval(timer)
    if (game[currentGameIdx].gcode) {
        sendGcode()
    }
    timer = setInterval(function() {
        if (gameTimer <= 0) {//时间用尽之前可以一直投，分数累计到下一关
            audioGameStartEl.pause()
            audioGameStartEl.currentTime = 0
            if (typeof bluetoothSerial !== 'undefined') {
                bluetoothSerial.write('gcode G0 X20 Z320 F6000\r\ngcode G90\r\n')
            }
            clearInterval(timer)
            if (scores >= game[currentGameIdx].balls) {//过关
                const nextGame = game[currentGameIdx + 1]
                if (nextGame) {
                    if (confirm('恭喜你，通过第 ' + game[currentGameIdx].id + ' 关，是否继续下一关？\n第 ' + nextGame.id + ' 关，' + nextGame.time + ' 秒内，在 ' + nextGame.desc + ' 的情况下获得 ' + nextGame.balls + ' 分')) {
                        currentGameIdx++
                        updateGameBoard()
                        startGameAlert()
                    } else {
                        resetGame()
                    }
                } else {
                    // 进入排行榜
                    let playerName
                    if (playerName = window.prompt('恭喜你，成功通关并荣登排行榜，请输入你的ID')) {
                        ranklist.push({
                            name: playerName,
                            score: scores
                        })
                        ranklist.sort(function(a, b) {
                            return b.score - a.score
                        })
                        renderRanklist()
                        updateRanklist()
                    }
                }
            } else {//时间耗尽
                alert('很遗憾，游戏失败')
                resetGame()
            }
        } else {
            gameTimer--
            counterEl.innerText = gameTimer
        }
    }, 1000)
}
function resetGame() {
    audioCoinEl.play()
    clearInterval(timer)
    startEl.disabled = false
    if (typeof bluetoothSerial !== 'undefined') {
        bluetoothSerial.write('gcode G0 X20 Z320 F6000\r\ngcode G90\r\n')
    }
    backToCoinPage()
    scores = 0
    gameTimer = 0
    currentGameIdx = 0
    isPlaying = false
    updateGameBoard()
}
function enterGamePage() {
    coinPage.style.zIndex = -1
    gamePage.style.zIndex = 1
}
function backToCoinPage() {
    coinPage.style.zIndex = 1
    gamePage.style.zIndex = -1
}
function updateGameBoard() {
    ballsEl.innerText = scores
    gameTimer = game[currentGameIdx].time
    levelEl.innerText = game[currentGameIdx].id
    counterEl.innerText = game[currentGameIdx].time
    conditionEl.innerText = game[currentGameIdx].balls
    descEl.innerText = game[currentGameIdx].desc
}
function countCoin(res) {
    coinQueue.push(res)       
    if (res === 'io.1:1') {
        if (coinQueue[coinQueue.length - 1] === 'io.1:1' && coinQueue[coinQueue.length - 2] === 'io.1:0') {
            // coinInserted = true
            enterGamePage()
        }
        coinQueue = []
    }
    // 防止内存使用过量
    if (coinQueue.length >= 100) {
        coinQueue.splice(0, coinQueue.length - 100)
    }
}
function countBtn(res) {
    btnQueue.push(res)       
    if (res === 'io.0:1') {
        if (btnQueue[btnQueue.length - 1] === 'io.0:1' && btnQueue[btnQueue.length - 2] === 'io.0:0') {
            // coinInserted = true
            // alert(11111)
            startCallback()
        }
        btnQueue = []
    }
    // 防止内存使用过量
    if (btnQueue.length >= 100) {
        btnQueue.splice(0, btnQueue.length - 100)
    }
}
function countBall(res) {
    ballQueue.push(res)       
    if (res === 'io.3:1') {
        if (ballQueue[ballQueue.length - 1] === 'io.3:1' && ballQueue[ballQueue.length - 2] === 'io.3:0') {// && ballQueue[ballQueue.length - 3] === 'io.2:1' && ballQueue[ballQueue.length - 4] === 'io.2:0') {
            if (isPlaying) {
                if (gameTimer > 0) {//防止提示下一关的时候提前投球
                    scores++
                    ballsEl.innerText = scores
                }
            }
        }
        ballQueue = []
    }
    // 防止内存使用过量
    if (ballQueue.length >= 100) {
        ballQueue.splice(0, ballQueue.length - 100)
    }
}
function connectBluetooth() {
    if (typeof bluetoothSerial !== 'undefined') {
        bluetoothSerial.connect('00:18:E4:35:43:74', () => {
            resEl.innerText = 'connect success'
            bluetoothSerial.subscribe('\n', (data) => {
                // alert(data)
                resEl.innerText = 'success: ' + data
    
                const res = data.toString().toLowerCase().replace('\n', '')
                if (res.startsWith('io.2') || res.startsWith('io.3')) {
                    countBall(res)
                } else if (res.startsWith('io.1')) {
                    countCoin(res)
                } else if (res.startsWith('io.0')) {
                    countBtn(res)
                }
            }, err => {
                resEl.innerText = 'Failure: ' + err
            });
            // gcode G90\r\ngcode G0 X0 Z320 F6000\r\n
            // bluetoothSerial.write('gcode G0 X320 F6000\r\n', () => {
            bluetoothSerial.write('gcode G28\r\n', () => {
            }, () => {
            })
            bluetoothSerial.write('io.3 k\r\n')//下方的光电传感器
            bluetoothSerial.write('io.2 k\r\n')//上方的光电传感器
            bluetoothSerial.write('io.1 k\r\n')//投币机
            bluetoothSerial.write('io.0 k\r\n')//按钮
        }, () => {
            resEl.innerText = 'connectFailure'
        });
    }
}
function updateRanklist() {
    localStorage.setItem('ranklist', JSON.stringify(ranklist))
}
function renderRanklist() {
    let html = ''
    for (let index = 0; index < ranklist.length; index++) {
        const rank = ranklist[index]
        html += '<tr><td>' + (index + 1) + '</td><td>' + rank.name + '</td><td>' + rank.score + '</td></tr>'
    }
    (typeof ranklistEl !== 'undefined') && (ranklistEl.innerHTML = html)
}
function sendGcode() {
    const validGcodeLines = game[currentGameIdx].gcode.length
    const timewaitPerLine = 30 * 1000 / validGcodeLines//包括移动的时间

    for (let i = 0; i < validGcodeLines; i++) {
        let timer = setTimeout(function() {
            clearTimeout(timer)
            if (typeof bluetoothSerial !== 'undefined') {
                bluetoothSerial.write('gcode ' + game[currentGameIdx].gcode[i])    
            }
        }, (i) * timewaitPerLine)
    }
    // bluetoothSerial.isConnected(() => {
    //     bluetoothSerial.write(gcode, () => {
    //         resolve()
    //     }, () => {
    //         reject('write gcode fail')
    //     })
    // }, (err) => {
    //     reject('not connect')
    //     // does not connect
    // })
}
