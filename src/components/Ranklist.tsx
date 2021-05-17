import { IonContent, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react"
import './Ranklist.css'

const Ranklist: React.FC = () => {
  const arr = new Array(20).fill(20)
  return (
    <IonContent>
      <IonList>
        {
          arr.map((val, key) => {
            return (
              <IonItem key={key}>
                <IonLabel>
                  <span className="id">
                    <span className={`no-${key + 1}`}>{key + 1}</span>
                  </span>
                  <span className="name">xxxxxx{key}</span>
                  <span className="score">{val}</span>
                </IonLabel>
              </IonItem>
            )
          })
        }
      </IonList>
    </IonContent>
  )
}

export default Ranklist