import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Plus } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';

interface Event {
  id: string;
  title: string;
  date: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData: Event[] = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'events');
    });
    return () => unsubscribe();
  }, []);

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'events'), { title, date });
      setTitle('');
      setDate('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  };

  return (
    <div className="glass rounded-3xl p-8 h-full flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
      <form onSubmit={addEvent} className="glass rounded-2xl p-4 flex gap-2">
        <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="bg-black/40 rounded-xl px-4 py-2 flex-1 outline-none"/>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-black/40 rounded-xl px-4 py-2 outline-none"/>
        <button type="submit" className="bg-violet-600 p-2 rounded-xl"><Plus /></button>
      </form>
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-violet-500" />
              <div>
                <p className="font-bold">{event.title}</p>
                <p className="text-xs text-zinc-400">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
