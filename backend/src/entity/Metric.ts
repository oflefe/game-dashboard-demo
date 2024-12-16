import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  game_name!: string;

  @Column({ type: "int" })
  downloads!: number;

  @Column({ type: "int" })
  dau!: number;

  @Column({ type: "int" })
  mau!: number;

  @Column({ type: "float" })
  arpu!: number;

  @Column({ type: "float" })
  arppu!: number;

  @Column({ type: "float" })
  retention_day1!: number;

  @Column({ type: "float" })
  retention_day7!: number;

  @Column({ type: "float" })
  retention_day30!: number;

  @Column({ type: "float" })
  revenue!: number;

  @Column({ type: "date" })
  date!: string;
}
