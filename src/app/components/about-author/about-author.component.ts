import { Component } from '@angular/core';

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html',
  styleUrls: ['./about-author.component.scss']
})
export class AboutAuthorComponent {
  githubUrl: string = "https://github.com/kaluzny1995";
  linkedinUrl: string = "https://www.linkedin.com/in/jakub-ka%C5%82u%C5%BCny-291096133/";
  facebookUrl: string = "https://www.facebook.com/dzh.awaria";
  mailString: string = "mailto:dzh.awaria@gmail.com?subject=Hello&body=Message for you...";

  universityUrl: string = "https://pwr.edu.pl/";

  projectUrls = {
    MFD: "https://github.com/kaluzny1995/MaskedFaceDetector",
    HSD: "https://github.com/kaluzny1995/HSD2.0"
  };
}
