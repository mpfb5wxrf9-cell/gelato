// Wrapper per la Contact Picker API del browser (permette all'utente di selezionare
// contatti dalla rubrica del dispositivo). Disponibile solo su Chrome/Edge Android;
// non esiste su iOS Safari né su desktop, per scelta delle piattaforme (nessuna API
// web consente di leggere la rubrica senza un'azione esplicita dell'utente).

interface ContactAddress {
  tel?: string[];
  name?: string[];
}

interface ContactsManager {
  select(properties: string[], options?: { multiple?: boolean }): Promise<ContactAddress[]>;
  getProperties(): Promise<string[]>;
}

function getContactsManager(): ContactsManager | null {
  const nav = navigator as Navigator & { contacts?: ContactsManager };
  return 'contacts' in navigator && nav.contacts ? nav.contacts : null;
}

export function isContactPickerSupported(): boolean {
  return getContactsManager() !== null;
}

export interface DeviceContact {
  name: string;
  phones: string[];
}

export async function pickContacts(): Promise<DeviceContact[]> {
  const manager = getContactsManager();
  if (!manager) throw new Error('Contact Picker non supportato su questo browser.');

  const results = await manager.select(['name', 'tel'], { multiple: true });
  return results.map((r) => ({
    name: r.name?.[0] || 'Sconosciuto',
    phones: r.tel || [],
  }));
}
