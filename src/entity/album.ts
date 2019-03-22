import { Song } from "./song";
import { Artist } from "./artist";
import { Entity, Column, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Album {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    title: string;
    
    @Column()
    author: Artist;
    
    @Column()
    tracks: Song[];
    
    @Column()
    genre: string;
}
