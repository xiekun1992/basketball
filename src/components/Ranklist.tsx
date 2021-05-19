import { IonContent, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react"
import { useRanklist } from "../hooks/useRanklist"
import './Ranklist.css'

interface ContainerProps { }

const Ranklist: React.FC<ContainerProps> = () => {
  const { ranklist } = useRanklist()
  return (
    <IonContent>
      <IonList>
        {
          ranklist.map((val, key) => {
            return (
              <IonItem key={key}>
                <IonLabel>
                  <span className="id">
                    <span className={`no-${key + 1}`}>{key + 1}</span>
                  </span>
                  <span className="name">{val.username}</span>
                  <span className="score">{val.balls}</span>
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