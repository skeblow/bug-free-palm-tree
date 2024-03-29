import { Item } from "../components/model/Item.ts"

export function parseItem (item: Item): Item {
  const text = item.description + item.title

  item = {
    ...item,
    year: parseYear(item.title) ?? parseYear(item.description) ?? item.year,
    mileage: parseMileage(item.title) ?? parseMileage(item.description) ?? item.mileage,
    power: parsePower(item.title) ?? parsePower(item.description) ?? item.power,
    is_automat: parseIsAutomat(text) ?? item.is_automat,
    model: parseModel(item.title) ?? parseModel(item.description) ?? item.model,
    engine: parseEngine(item.title) ?? parseEngine(item.description) ?? item.engine,
  }

  return item
}

function parseEngine (text: string): string|null {
  text = text.replace(' 4x4', '')

  let matches = text.match(/(forester|motor|outback|benzin|legacy|subaru|tribeca|impreza|wrx|levorg|ombi|justy)e?m? \w?\w? ?([1,2,3][\.\,][0,5,6])/i)

  if (matches && matches[2]) {
    return matches[2].replace(',', '.')
  }

  const oneAndThreeLiter = [
    /1.3i/i,
    /1328 cm3/i,
    /1.3 \d{2}kw/i,
    /Justy 1.3/i,
  ]

  const oneAndFiveLiter = [
    /1 ?498 ?ccm/i,
  ]

  const oneAndSixLiter = [
    /1.6 (gts|t)/i,
    /1.6i/i,
    /1.6t/i,
    /1.6, benz/,
  ]

  const twoLiter = [
    /2.0 ?x?t/i,
    /(dvoulitr|2.0) benzín/i,
    /1 ?994 ccm/i,
    /1 ?995 cm3/i,
    /1 ?998 ?ccm/i,
    /1 ?988 ?ccm/i,
    /1998 cm³/i,
    /2.0 (Boxer|l)/i,
    /2.od/i,
    /FB20/i,
    /DIESEL 2.0D/i,
    /2.0i/i,
    /2.0r/i,
    /2.0 ?d/i,
    /2.0 r/i,
    /boxer 2.0/i,
    /EJ20/i,
    /motor 2l benzín/i,
    /motor: 2.0/i,
    /2.0 ?l/i,
    /, 2.0 1\d{2}kw/i,
  ]

  const twoAndHalfLiter = [
    /2.5 ?T/i,
    /ej25/i,
    /2.5 ?i/i,
    /2457cm3/i,
    /2500ccm/i,
    /2.5litru/i,
    /2,5 xt/i,
    /2.5xi/i,
    /2.5 12\dkw/i,
    /2.5 ?l/i,
  ]

  const threeLiter = [
    /3.0h6/i,
    /3 ?000 ?ccm/i,
    /h6 180kw/i,
  ]

  const threeAndSixLiter = [
    /3 630 ccm/i,
  ]

  for (const pattern of oneAndThreeLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '1.3'
    }
  }

  for (const pattern of oneAndFiveLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '1.5'
    }
  }

  for (const pattern of oneAndSixLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '1.6'
    }
  }

  for (const pattern of twoLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '2.0'
    }
  }

  for (const pattern of twoAndHalfLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '2.5'
    }
  }

  for (const pattern of threeLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '3.0'
    }
  }

  for (const pattern of threeAndSixLiter) {
    matches = text.match(pattern)

    if (matches) {
      return '3.6'
    }
  }

  return null
}

function parseModel (text: string): string|null {
  const outbackPatterns = [
    /outback/i,
    /qutback/i,
  ]

  const foresterPatterns = [
    /forester/i,
    /forestr/i,
  ]

  const imprezaPatterns = [
    /impreza/i,
    /impresa/i,
  ]

  for(const pattern of outbackPatterns) {
    const matches = text.match(pattern)

    if (matches) {
      return 'outback'
    }
  }

  for(const pattern of foresterPatterns) {
    const matches = text.match(pattern)

    if (matches) {
      return 'forester'
    }
  }

  let matches = text.match(/levorg/i)

  if (matches) {
    return 'levorg'
  }

  matches = text.match(/wrx sti/i)

  if (matches) {
    return 'impreza'
  }

  matches = text.match(/legacy/i)

  if (matches) {
    return 'legacy'
  }

  for(const pattern of imprezaPatterns) {
    const matches = text.match(pattern)

    if (matches) {
      return 'impreza'
    }
  }

  matches = text.match(/justy/i)

  if (matches) {
    return 'justy'
  }

  matches = text.match(/tribeca/i)

  if (matches) {
    return 'tribeca'
  }

  matches = text.match(/xv/i)

  if (matches) {
    return 'crosstrek'
  }

  matches = text.match(/crosstrek/i)

  if (matches) {
    return 'crosstrek'
  }

  matches = text.match(/brz/i)

  if (matches) {
    return 'brz'
  }

  return null
}

function parseYear (text: string): number|null {
  const longYearPatterns = [
    /r\. ?v?\.?:? ?(2\d{3})/i,
    /r,v (2\d{3})/i,
    /rv\. ?(2\d{3})/i,
    /rv (2\d{3})/i,
    /rv:? \d{1,2}\/(2\d{3})/i,
    /r\.v\.(2\d{3})/i,
    /r\.v\. ?\d{1,2}\/(2\d{3})/i,
    /r.v : \d{1,2}\/(2\d{3})/i,
    /rok výroby:? \d{0,2}\/?(2\d{3})/i,
    /rok výroby:? (2\d{3})/i,
    /rok výroby \d{1,2} \/(2\d{3})/i,
    /Rok výroby:\d{1,2}\/(2\d{3})/i,
    /rok: \d{2} \/ (2\d{3})/i,
    /awd (2\d{3})/i,
    /registrace: \d{1,2}\.\d{1,2}\.(2\d{3})/i,
    /datum 1. registrace \d{1,2}\/(2\d{3})/i,
    /první registrace: \d{1,2}\/(2\d{3})/i,
    /v provozu od:?\s+\d{2}[\/-]?(2\d{3})/i,
    /v provozu od ?\d{0,2}\/?(2\d{3})/i,
    /do provozu: \d{1,2}\/(2\d{3})/i,
    /uvedeno do provozu:? \d{1,2}.\d{1,2}.(2\d{3})/i,
    /v provozu od:\d{1,2}. \d{1,2}. (2\d{3})/i,
    /v provozu od:\d{1,2}\/\d{1,2}\/(2\d{3})/i,
    /2.0d (2\d{3})/i,
    /2,0d rok (2\d{3})/i,
    /2,0d \d{1,2}\/(2\d{3})/i,
    /kw my (2\d{3})/i,
    /výroba (2\d{3})/i,
    /vyrobeno (2\d{3})/i,
    /outback (2\d{3})/i,
    /legacy (2\d{3})/i,
    /kw, rok \d\/(2\d{3})/i,
    /kw, 4x4, rok (2\d{3})/i,
    /kw, \d{1,2}\/(2\d{3})/i,
    /4x4, \d{1,2}\/(2\d{3})/i,
    /reg.: \d{1,2}\/(2\d{3})/i,
    /exclusive\s+- (2\d{3})\/\d{1,2}/i,
    /subaru z roku (2\d{3})/i,
  ]
  let matches

  for (const pattern of longYearPatterns) {
    matches = text.match(pattern)

    if (matches && matches[1]) {
      return parseInt(matches[1])
    }
  }

  const shortYearPatterns = [
    /r\.v\.: \d{2}\/([1,2]\d{1})/i,
    /uvedeni do provozu \d{1,2}\/([1,2]\d{1})/i,
  ]

  for (const pattern of shortYearPatterns) {
    matches = text.match(pattern)

    if (matches && matches[1]) {
      return parseInt('20' + matches[1])
    }
  }

  return null
}

function parseMileage (text: string): number|null {
  let matches = text.match(/(\d+) ?(tkm|tisíc km|tis km)/i)

  if (matches && matches[1]) {
    return parseInt(matches[1]) * 1000
  }

  matches = text.match(/najeto ([\d ]{6,})/i)

  if (matches && matches[1]) {
    return parseInt(matches[1].replace(/\s+/, ''))
  }

  matches = text.match(/najeto \w+? ?(\d+)/i)

  if (matches && matches[1]) {
    return parseInt(matches[1])
  }

  return null
}

function parsePower (text: string): number|null {
  const matches = text.match(/(\d+) ?kw/i)

  if (matches && matches[1]) {
    return parseInt(matches[1])
  }

  return null
}

function parseIsAutomat (text: string): boolean|null {
  const autoPatterns = [
    /Automatická převodovka/i,
    /cvt/i,
  ]

  let matches = text.match(/manuál/i)

  if (matches) {
    return false
  }

  for (const pattern of autoPatterns) {
    matches = text.match(pattern)

    if (matches) {
      return true
    }
  }

  return null
}
