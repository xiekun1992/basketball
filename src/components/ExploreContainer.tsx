import { IonAlert, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useBall } from '../hooks/useBall';
import './ExploreContainer.css';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  const {
    seconds,
    requirements,
    balls,
    level,
    desc,
    showAlert,
    message,
    isPlaying,
    startGameAlert
  } = useBall()

  return (
    <div className="container">
      <strong>倒计时：{seconds}秒</strong>
      <div className="total-balls">
        已投进{balls}球
      </div>
      <p>
        第{level}关<br/>
        过关条件：投进{requirements}球<br/>
        关卡说明：{desc}
      </p>
      {/* <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p> */}
      <IonButton disabled={isPlaying} expand="full" size="large" onClick={startGameAlert.bind(null, void(0))}>开始</IonButton>
      <div style={{display: showAlert ? 'block': 'none'}} className="start-game-alert">
        {message}
      </div>
      {/* <IonAlert
          isOpen={showAlert}
          // onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'预备'}
          // subHeader={'Subtitle'}
          message={message}
          buttons={['OK']}
        /> */}
    </div>
  );
};

export default ExploreContainer;
