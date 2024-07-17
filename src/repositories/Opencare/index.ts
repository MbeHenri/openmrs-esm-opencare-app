import { type TypeRepository } from "../TypeRepository";
import ProdOpencareRepository from "./prodRepository";
import OpencareRepository from "./repository";

export function getOpencareRepository(
  t: TypeRepository = "fake"
): OpencareRepository {
  if (t === "fake") {
    return new OpencareRepository();
  }
  return new ProdOpencareRepository();
}
