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

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    let resQueue = []
    bluetoothSerial.connect(['00', '18', 'E4', '35', '43', '74'].join(':'), () => {
        resEl.innerText = 'connect success'
        bluetoothSerial.subscribe('\n', (data) => {
            resEl.innerText = 'success: ' + data

            const res = data.toString().toLowerCase().replace('\n', '')
            resQueue.push(res)
            
            if (res === 'io.3:1') {
                // console.log(resQueue)
                if (resQueue[resQueue.length - 1] === 'io.3:1' && resQueue[resQueue.length - 2] === 'io.3:0' && resQueue[resQueue.length - 3] === 'io.2:1' && resQueue[resQueue.length - 4] === 'io.2:0') {
                    // console.log('+1')
                    scoreEl.innerText = '+1 ' + (new Date())
                }
                resQueue = []
            }
            // 防止内存使用过量
            if (resQueue.length >= 100) {
                resQueue.splice(0, resQueue.length - 100)
            }

        }, err => {
            resEl.innerText = 'Failure: ' + err
        });
        bluetoothSerial.write('io.3 k\r\n')
        bluetoothSerial.write('io.2 k\r\n')
    }, () => {
        resEl.innerText = 'connectFailure'
    });
}
