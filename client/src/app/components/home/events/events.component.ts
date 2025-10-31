import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventItem, events } from '../../../data/event.interface';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  @HostBinding('class.open') isOpen = false;

  toggle() { this.isOpen = !this.isOpen; }

  get upcomingEvents(): EventItem[] {
    const today = new Date(); today.setHours(0,0,0,0);
    return events
      .filter(e => (e.endDate ?? e.startDate) >= today)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 3);
  }

  // "Aug 21–23, 2025" or "Oct 18, 2025"
  formatRange(e: EventItem): string {
    const s = e.startDate, t = e.endDate ?? e.startDate;
    const sameDay   = s.toDateString() === t.toDateString();
    const sameMonth = s.getFullYear() === t.getFullYear() && s.getMonth() === t.getMonth();
    const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    const yS  = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(s);
    if (sameDay) return `${fmt.format(s)}, ${yS}`;
    if (sameMonth) return `${fmt.format(s)}–${new Intl.DateTimeFormat('en-US',{day:'numeric'}).format(t)}, ${yS}`;
    return `${fmt.format(s)}, ${yS} – ${new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(t)}`;
  }

  // Shorten address for summary line (city/state-ish)
  shortAddress(addr: string): string {
    // naive: take last 2 comma groups if present
    const parts = addr.split(',').map(s => s.trim());
    if (parts.length >= 2) return parts.slice(-2).join(', ');
    return addr;
  }
}
