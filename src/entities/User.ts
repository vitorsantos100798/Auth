import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text" })
  name: string | undefined;

  @Column({ type: "text", unique: true })
  email: string | undefined;

  @Column({ type: "text" })
  password: string | undefined;
}
