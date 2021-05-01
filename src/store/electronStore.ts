
import Connection from "@/model/Connection";
import ElectronStore from "electron-store";

interface KafkaVueStore {
  connections: string[];
  connection: string | null
}

const persistentStore = new ElectronStore<KafkaVueStore>({
  defaults: {
    connections: [],
    connection: null
  },
});

const getConnections = (): Array<Connection> => {
  const cs = persistentStore.get("connections")
  return cs.map(cs => {
    const c = cs.split("|")
    return new Connection(c[0], c[1])
  })
}

const setConnections = (connections: Array<Connection>): void => {
  const a: string[] = connections.map(cs => {
    return `${cs.name}|${cs.boostrapServers.join(',')}`
  })
  persistentStore.set("connections", a)
}



export default {
  getConnections,
  setConnections
}


