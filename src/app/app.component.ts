import { Component, ElementRef, OnInit, HostListener, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';

import { PLAY, PAUSE, RESUME } from './core/actions';
import { AppState } from './core/app-state.model';
import { PlayerState } from './core/player-state.model';
import { PulseService } from './core/pulse.service';
import { AudioPlayerService } from './audio/audio-player.service';

@Component({
  selector: 'in-c-app',
  template: `
    <in-c-sound-vis [nowPlaying]="nowPlaying$ | async"
                    [width]="width"
                    [height]="visHeight"
                    [playerCount]="(players$ | async).size">
    </in-c-sound-vis>
    <in-c-title *ngIf="!(playing$ | async)">
    </in-c-title>
    <in-c-player-controls *ngIf="playing$ | async"
                          [playerStates]="players$ | async">
    </in-c-player-controls>
    <in-c-intro *ngIf="!(playing$ | async)"
                (play)="play()">
    </in-c-intro>
    <in-c-top-bar [paused]="paused$ | async"
                  (pause)="pause()"
                  (resume)="resume()">
    </in-c-top-bar>
  `,
  styles: [`
    in-c-sound-vis, in-c-title {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      height: 61.8%;
    }
    in-c-player-controls, in-c-intro {
      position: fixed;
      left: 0;
      right: 0;
      top: 61.8%;
      bottom: 0;
    }
  `]
})
export class AppComponent implements OnInit {

  playing$ = this.store.select('playing').distinctUntilChanged();
  paused$ = this.store.select('paused').distinctUntilChanged();
  players$ = this.store.select('players');
  nowPlaying$ = this.store.select('nowPlaying');

  width = 0;
  visHeight = 0;

  constructor(private store: Store<AppState>,
              private audioPlayer: AudioPlayerService) {
  }

  ngOnInit() {
    this.setSize();
  }

  @HostListener('window:resize')
  setSize() {
    this.width = window.innerWidth
    this.visHeight = window.innerHeight * 0.618;
  }

  play() {
    this.audioPlayer.enableAudioContext();
    this.store.dispatch({type: PLAY});
  }

  pause() {
    this.store.dispatch({type: PAUSE});
  }

  resume() {
    this.store.dispatch({type: RESUME});
  }

}
