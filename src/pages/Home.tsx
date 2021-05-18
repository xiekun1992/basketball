import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Ranklist from '../components/Ranklist';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>投篮小游戏</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">投篮小游戏</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer/>
        <div style={{height: 'calc(100% - 280px)', overflow: 'hidden'}}>
          <h2 style={{textAlign: 'center'}}>排行榜</h2>
          <IonList>
            <IonItem>
              <IonLabel>
                <span className="id">排名</span>
                <span className="name">ID</span>
                <span className="score">进球数</span>
              </IonLabel>
            </IonItem>
          </IonList>
          <div style={{height: 'calc(100% - 120px)'}}>
            <Ranklist />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
