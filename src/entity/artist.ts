import { Entity, Column, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Artist{
    
    @ObjectIdColumn()
    id: ObjectID;
    
    @Column()
    name: string;
    
    @Column()
    surname: string;
    
    @Column()
    yearBorn?: number;
    
    @Column()
    yearDied?: number;
    
    @Column()
    country?: string;
}