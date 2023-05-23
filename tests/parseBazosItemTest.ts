import { Item } from "../components/model/Item.ts"
import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts"
import { parseBazosItem } from '../service/Bazos.ts'

function createEmptyItem(): Item {
  return {
    id: null,
    title: '',
    url: '',
    site: '',
    description: '',
    is_active: true,
    is_parsed: false,
    is_checked: false,
    main_image: '',
    year: null,
    mileage: null,
    model: null,
    generation: null,
    engine: null,
    power: null,
    is_automat: null,
  }
}

Deno.test("bazos forester 1", () => {
  const item = {
    ...createEmptyItem(),
    description: 'ester XT ... automat!!!....05...225tkm,teď bude nov',
  }

  assertEquals(
    parseBazosItem(item),
    {
      ...item,
      mileage: 225000,
      // is_automat: true,
    },
  );
});
