interface Obj {
  id: string
  even?: boolean
}

export async function mapper(o: Obj, _index: number): Promise<Obj | undefined> {
  if (o.even) return // filter out evens
  return {
    ...o,
    extra: o.id + '_',
  } as any
}
