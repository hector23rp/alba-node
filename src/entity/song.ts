import { Entity, Column, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Song {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;
    
    @Column()
    durationSecs: number;
}
