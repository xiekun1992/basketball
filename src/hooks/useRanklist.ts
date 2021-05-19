import { useEffect, useState } from "react";
import { useStorage } from '@ionic/react-hooks/storage'

export function useRanklist() {
  let [ranklist, setRanklist] = useState<Rank[]>([])
  const { get, set } = useStorage()

  const RANKLIST_STORAGE = 'ranklist'
  
  const addToRanklist = (rank: Rank) => {
    const newRanklist: Rank[] = [...ranklist, rank]
    newRanklist.sort((a, b) => (b.balls - a.balls))

    setRanklist(newRanklist)
    set(RANKLIST_STORAGE, JSON.stringify(newRanklist))
  }
  useEffect(() => {
    const loadSaved = async () => {
      const ranklistStr = await get(RANKLIST_STORAGE)
      const ranklist = (ranklistStr ? JSON.parse(ranklistStr) : []) as Rank[]
      ranklist.sort((a: Rank, b: Rank) => {
        return b.balls - a.balls
      })
      setRanklist(ranklist)
    }
    loadSaved()
  }, [get])
  return {
    ranklist,
    addToRanklist
  }
}

interface Rank {
  username: string
  balls: number
}