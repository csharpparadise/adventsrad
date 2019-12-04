import { Component, OnInit } from '@angular/core';
import { TeamMateService } from 'src/services/team-mate.service';

@Component({
  selector: 'app-mates',
  templateUrl: './mates.component.html',
  styleUrls: ['./mates.component.css']
})
export class MatesComponent implements OnInit {

  members: string[] = [];
  constructor(private teamService: TeamMateService) {
    this.loadMembers();
  }

  ngOnInit() {
  }

  loadMembers() {
    this.members = this.teamService.getPlayers();
  }

  public won(member: string) {
    this.teamService.removePlayer(member);
    this.loadMembers();
  }

  public reset() {
    this.teamService.restorePlayers();
    this.loadMembers();
  }
}
