import { RepositoryCustom } from "./repository";
import { Artist } from "../entity/artist";
import { Album } from "../entity/album";
import { Song } from "../entity/song";
import { createConnection } from "typeorm";

export class InMemoryRepository<T> implements RepositoryCustom<T> {
    private data: { [key: string]: T };
    private idField: keyof T;
    private sequencer = 0;
    private type: string;
    private connection;

    constructor(idField: keyof T, type: string) {
        this.data = {};
        this.idField = idField;
        this.type = type;
        this.createConnectionMongoDB();
    }

    private createUniqueKey(): string {
        // Asumes key as string
        const key = 'e' + (this.sequencer++).toString();
        return key;
    }

    private createInstanceRepository(obj: any){
        switch (this.type) {
            case "Artist":
                let artist = new Artist();
                artist.name = obj.name;
                artist.surname = obj.surname;
                if (obj.yearBorn) artist.yearBorn = obj.yearBorn;
                if (obj.yearDied) artist.yearDied = obj.yearDied;
                if (obj.country) artist.country = obj.country;
                return artist;
                break;
            case "Album":
                let album = new Album();
                album.title = obj.title;
                let artistAlbum = new Artist();
                artistAlbum.name = obj.author;
                album.author = artistAlbum;
                let tracks: Song[] = [];
                obj.tracks.forEach(track => {
                    let song = new Song();
                    song.name = track.name;
                    tracks.push(song);
                });
                album.tracks = tracks;
                album.genre = obj.genre;
                return album;
                break;
            case "Song":
                let song = new Song();
                song.name = obj.name;
                song.durationSecs = obj.durationSecs;
                return song;
                break;
        }
    }

    async createConnectionMongoDB() {
        this.connection = await createConnection();
        console.log('Conexión creada: ' + this.connection);
    }

    async get(criteria: any): Promise<T[]> {
        // ignore criteria
        return Object.keys(this.data).map(k => this.data[k]);
    }
    async getById(id: string): Promise<T> {
        const candidate: T = this.data[id];
        return candidate;
    }
    async create(obj: T): Promise<T> {
        if  (!obj) {
            throw new Error('Missing object for creation');
        }
        const instance = this.createInstanceRepository(obj);
        const result = await this.connection.mongoManager.save(instance);
        return result;
    }
    async update(id: string, obj: T): Promise<T> {
        if  (!obj) {
            throw new Error('Missing object for update');
        }
        this.data[id] = obj;
        return obj;
    }
    async delete(id: string): Promise<T> {
        const candidate = this.data[id];
        if (candidate) {
            delete this.data[id];
        }
        return candidate;
    }
}
