import { Passkey } from '@do-ob/auth/api';

let databaseName = 'keychain';
let openRequest: IDBOpenDBRequest;
let database: IDBDatabase;

function initInstance(request: IDBOpenDBRequest) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if(database) {
      resolve(database);
      return;
    }

    request.onerror = (event) => {
      console.error('Could not open keychain database', event.target);
      reject(event.target);
    };

    request.onsuccess = () => {
      database = request.result;
      resolve(database);
    };

    request.onupgradeneeded = () => {
      const passkeyStore = request.result.createObjectStore('passkey', { keyPath: 'id' });
      passkeyStore.createIndex('name', 'name', { unique: true });
    };
  });
}

export async function setName(name: string) {
  if(databaseName === name) {
    return;
  }

  databaseName = name;
  openRequest = undefined;
  database = undefined;
}

export async function db() {
  if(openRequest) {
    return await initInstance(openRequest);
  }

  openRequest = indexedDB.open(databaseName, 1);

  return await initInstance(openRequest);
}

function insertPasskey(passkey: Passkey) {
  return new Promise<void>((resolve, reject) => {
    db().then((db) => {
      const passkeyStore = db.transaction('passkey', 'readwrite').objectStore('passkey');

      const result = passkeyStore.put(passkey);

      result.onsuccess = () => {
        resolve();
      };

      result.onerror = (event) => {
        console.error('Could not insert passkey', event.target);
        reject(event.target);
      };
    });
  });
}

export async function insert(passkey: Passkey) {
  return await insertPasskey(passkey);
}

function getPasskeyById(id: string) {
  return new Promise<Passkey>((resolve, reject) => {
    db().then((db) => {
      const passkeyStore = db.transaction('passkey').objectStore('passkey');

      const result = passkeyStore.get(id);

      result.onsuccess = () => {
        resolve(result.result);
      };

      result.onerror = (event) => {
        console.error('Could not get passkey', event.target);
        reject(event.target);
      };
    });
  });
}

export async function getById(id: string) {
  return await getPasskeyById(id);
}

function getPasskeyByName(name: string) {
  return new Promise<Passkey>((resolve, reject) => {
    db().then((db) => {
      const passkeyStore = db.transaction('passkey').objectStore('passkey').index('name');

      const result = passkeyStore.get(name);

      result.onsuccess = () => {
        resolve(result.result);
      };

      result.onerror = (event) => {
        console.error('Could not get passkey', event.target);
        reject(event.target);
      };
    });
  });
}

export async function getByName(name: string) {
  return await getPasskeyByName(name);
}

function deletePasskey(id: string) {
  return new Promise<void>((resolve, reject) => {
    db().then((db) => {
      const passkeyStore = db.transaction('passkey', 'readwrite').objectStore('passkey');

      const result = passkeyStore.delete(id);

      result.onsuccess = () => {
        resolve();
      };

      result.onerror = (event) => {
        console.error('Could not delete passkey', event.target);
        reject(event.target);
      };
    });
  });
}

export async function remove(id: string) {
  return await deletePasskey(id);
}

function listPasskeys() {
  return new Promise<Passkey[]>((resolve, reject) => {
    db().then((db) => {
      const passkeyStore = db.transaction('passkey').objectStore('passkey');

      const result = passkeyStore.getAll();

      result.onsuccess = () => {
        resolve(result.result);
      };

      result.onerror = (event) => {
        console.error('Could not list passkeys', event.target);
        reject(event.target);
      };
    });
  });
}

export async function list() {
  return await listPasskeys();
}
