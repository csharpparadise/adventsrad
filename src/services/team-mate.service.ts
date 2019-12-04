import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamMateService {

  readonly team = ['Danny', 'Alex', 'Daniel', 'Christof', 'Andreas', 'Uwe', 'Igor', 'Eric'];
  readonly STORAGE_KEY = 'advent_players';

  constructor() { }

  getPlayers(): string[] {
    const playersInStore = localStorage.getItem(this.STORAGE_KEY);

    if (!playersInStore) {
      this.restorePlayers();
      return this.team;
    }

    return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
  }

  removePlayer(player: string) {
    const players = this.getPlayers();
    const index = players.indexOf(player);
    players.splice(index, 1);

    const playersJson = JSON.stringify(players);
    localStorage.setItem(this.STORAGE_KEY, playersJson);
  }

  restorePlayers() {
    const playersJson = JSON.stringify(this.team);
    localStorage.setItem(this.STORAGE_KEY, playersJson);
  }
}
