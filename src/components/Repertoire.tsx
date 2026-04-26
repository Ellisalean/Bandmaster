import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Music, Plus } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';

interface Song {
  id: string;
  title: string;
  chords: string;
  pdfUrl: string;
}

export default function Repertoire() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState('');
  const [chords, setChords] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'songs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songsData: Song[] = [];
      snapshot.forEach((doc) => {
        songsData.push({ id: doc.id, ...doc.data() } as Song);
      });
      setSongs(songsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'songs');
    });

    return () => unsubscribe();
  }, []);

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'songs'), { title, chords, pdfUrl: '' });
      setTitle('');
      setChords('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'songs');
    }
  };

  return (
    <div className="glass rounded-3xl p-8 h-full flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-3xl font-bold tracking-tight">Repertorio</h2>
      <form onSubmit={addSong} className="glass rounded-2xl p-4 flex gap-2">
        <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="bg-black/40 rounded-xl px-4 py-2 flex-1 outline-none"/>
        <input placeholder="Acordes" value={chords} onChange={e => setChords(e.target.value)} className="bg-black/40 rounded-xl px-4 py-2 flex-1 outline-none"/>
        <button type="submit" className="bg-violet-600 p-2 rounded-xl"><Plus /></button>
      </form>
      <div className="grid gap-4">
        {songs.map((song) => (
          <div key={song.id} className="glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="text-violet-500" />
              <div>
                <p className="font-bold">{song.title}</p>
                <p className="text-xs text-zinc-400">{song.chords}</p>
              </div>
            </div>
            <button className="text-sm bg-violet-600 px-4 py-2 rounded-xl">Ver</button>
          </div>
        ))}
      </div>
    </div>
  );
}
