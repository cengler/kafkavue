
import Connection from '@/model/Connection'
import ElectronStore from 'electron-store'

interface KafkaVueStore {
  connections: string[];
  connection: string | null;
}

const persistentStore = new ElectronStore<KafkaVueStore>({
  defaults: {
    connections: [],
    connection: null
  }
})

const fromString = (cs: string): Connection => {
  const c = cs.split('|')
  return new Connection(Number.parseInt(c[0]), c[1], c[2])
}

const toString = (cs: Connection): string => {
  return `${cs.id}|${cs.name}|${cs.boostrapServers.join(',')}`
}

const getConnections = (): Array<Connection> => {
  const cs = persistentStore.get('connections')
  return cs.map(cs => fromString(cs))
}

const setConnections = (connections: Array<Connection>): void => {
  const a: string[] = connections.map(cs => toString(cs))
  persistentStore.set('connections', a)
}

const getConnection = (): Connection | null => {
  const c = persistentStore.get('connection')
  return c ? fromString(c) : null
}

const setConnection = (c: Connection | null): void => {
  if (!c) {
    persistentStore.set('connection', null)
  } else {
    persistentStore.set('connection', toString(c))
  }
}

export default {
  getConnections,
  setConnections,
  getConnection,
  setConnection
}
