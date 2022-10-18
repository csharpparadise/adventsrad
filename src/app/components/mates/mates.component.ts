import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TeamMateService } from 'src/services/team-mate.service';

@Component({
  selector: 'app-mates',
  templateUrl: './mates.component.html',
  styleUrls: ['./mates.component.css']
})
export class MatesComponent implements OnInit {

  @Output() onMatelistChanged = new EventEmitter<any>();

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
    if (this.members.length > 1) {
      this.teamService.removePlayer(member);
      this.loadMembers();

      this.onMatelistChanged.emit();
    }
    else {
      this.reset();
    }
  }

  public reset() {
    this.teamService.restorePlayers();
    this.loadMembers();

    this.onMatelistChanged.emit();
  }
}
