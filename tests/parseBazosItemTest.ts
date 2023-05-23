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
    price: null,
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
    description: 'ester XT ... automat!!!....05...225tkm,teď',
  }

  assertEquals(
    parseBazosItem(item),
    {
      ...item,
      mileage: 225_000,
      // is_automat: true,
    },
  );
});

Deno.test("bazos forester 2", () => {
  const item = {
    ...createEmptyItem(),
    description: 'Prodám Subaru Forester 2.0 XT 130kw. Najeto 360 tisíc km.',
  }

  assertEquals(
    parseBazosItem(item),
    {
      ...item,
      mileage: 360_000,
      power: 130,
    },
  );
});

Deno.test("bazos forester 3", () => {
  const item = {
    ...createEmptyItem(),
    description: 'Subaru Forester 2.0X, r.v. 2007/12, 116kw model SG pofaceliftu Manuální převodovka Najeto cca 157000,',
  }

  assertEquals(
    parseBazosItem(item),
    {
      ...item,
      year: 2007,
      mileage: 157_000,
      power: 116,
      is_automat: false,
    },
  );
});

Deno.test("bazos forester 4", () => {
  const item = {
    ...createEmptyItem(),
    description: 'oze motor 2.5 Turbo 169kw, najeto 250 000km ,automatická převodovka, o'
  }

  assertEquals(
    parseBazosItem(item),
    {
      ...item,
      mileage: 250_000,
      power: 169,
      is_automat: true,
    },
  );
});
