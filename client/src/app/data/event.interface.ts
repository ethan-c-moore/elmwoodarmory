export interface EventItem {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  address: string;
  img: string;
  link: string;
}

export const events: EventItem[] = [
    // {
    //   name: 'Utah Ren Faire',
    //   description: 'Utah Valley Arts presents the 13th Annual Utah Renaissance Faire',
    //   startDate: new Date('2025-08-21'),
    //   endDate: new Date('2025-08-23'),
    //   address: 'Mt. Nebo Botanical Farm 3700 Old Hwy 91, Mona, UT 84645',
    //   img: 'assets/img/events/utf-logo.png',
    //   link: 'https://utahrenfaire.utahvalleyarts.com/'
    // },
    {
        name: 'Country Hearts Botique',
        description: '',
        startDate: new Date('2025-11-1'),
        endDate: new Date('2025-11-1'),
        address: 'Millard County Fair Building, 187 South Manzanita Ave., Delta, UT 84624',
        img: '',
        link: 'https://chboutique.com/'
    },
    {
        name: 'Frost and Fable Renaissance Market',
        description: 'Well met travelers, Renaissance lovers, and Christmas enthusiasts!',
        startDate: new Date('2025-11-21'),
        endDate: new Date('2025-11-22'),
        address: '1200 Towne Center Blvd #2090 Provo, UT 84601',
        img: '',
        link: 'https://www.spanishfork.org/parksrec/page/holiday-gift-fair'
    }
]