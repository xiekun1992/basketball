import { IonButton } from '@ionic/react';
import { useBall } from '../hooks/useBall';
import './ExploreContainer.css';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  const {
    seconds,
    requirements,
    startGame
  } = useBall()
  
  return (
    <div className="container">
      <strong>倒计时：{seconds}秒</strong>
      <p>过关条件：投进{requirements}球</p>
      {/* <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p> */}
      <IonButton expand="full" size="large" onClick={startGame}>开始</IonButton>
    </div>
  );
};

export default ExploreContainer;
