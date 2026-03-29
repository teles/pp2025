import type { CuisineTag, PromoTag } from '@/types/place'
import { normalize } from '@/lib/utils'

function match(all: string, ...patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(all))
}

export function inferTags(
  nome: string,
  experiencia: string,
  slug: string,
): { cuisineTags: CuisineTag[]; promoTags: PromoTag[] } {
  const all = normalize(nome + ' ' + experiencia + ' ' + slug)

  const cuisine: CuisineTag[] = []
  const promo: PromoTag[] = []

  if (match(all, /pizza|trattoria|focacceria|piadina/))
    cuisine.push('pizza')
  if (match(all, /hamburguer|burger|lanche/))
    cuisine.push('hamburguer')
  if (
    match(all, /guioza|gyoza|dim.?sum|macarrao|ramen|sushi|asiat|dumpling/) ||
    /panda|sakeumi|yong|hacken|icone/.test(slug)
  )
    cuisine.push('asiatico')
  if (
    match(all, /carbonara|nhoque|focacc|trattoria|piadina|bruschetta/) ||
    /braz|daje|balcone|ombra|emporio|toscana/.test(slug)
  )
    cuisine.push('italiano')
  if (match(all, /taco|mexicano|burrito/) || /dedo-de-la-chica|gua-co|the-taco/.test(slug))
    cuisine.push('mexicano')
  if (match(all, /kibe|falafel|kebab|kafta|merguez|mezze|hummus|pita/))
    cuisine.push('arabe')
  if (
    match(all, /moussaka|clericot|pintxo|pan y tomat|paella|espanho|grego|taverna/) ||
    /petros|pintxos|nos-otros|cicci/.test(slug)
  )
    cuisine.push('mediterraneo')
  if (
    match(all, /chop[pe]|cerveja|balde de cer|pint/) ||
    /bar-do-quintal|piraja|beer4|bar-exquisito|casquinha|o-pasquim|trinca/.test(slug)
  )
    cuisine.push('bar-chopp')
  if (match(all, /vinho|espumante|harmoniz|vermute|clericot|jarra de vinho|taca de vinho/))
    cuisine.push('vinho')
  if (
    match(all, /brunch|cafeteria|expresso|coffee|pao na chapa|bebida quente/) ||
    /coffee|rendez|feliciana|ripito|hm-food/.test(slug)
  )
    cuisine.push('cafe-brunch')
  if (match(all, /gelato|sorvete/))
    cuisine.push('gelato')
  if (match(all, /cookie|cinnamon|pipoca|pastel|sobremesa|torta zebra/))
    cuisine.push('doces')

  if (match(all, /acompanhante ganha|ganhe outro|ganha outro/))
    promo.push('2por1')
  if (/50%/.test(experiencia))
    promo.push('50pct')
  if (match(all, /happy hour/))
    promo.push('happyhour')
  if (match(all, /rodizio|rodízio/))
    promo.push('rodizio')

  return { cuisineTags: cuisine, promoTags: promo }
}
