// javascript to convert .bww to .abc
// Copyright (C) 2018-2023 Jean-Francois Moine
// License GPL3+
//
//
// Modified by Michael Eskin for the ABC Transcription Tools
//
// documentation about BWW:
//	BNF http://forums.bobdunsire.com/forums/showthread.php?t=123219
//	Bagpipe_Reader.pdf

// grace notes adapted from
// https://raw.githubusercontent.com/ChurchOrganist/MuseScore/master/bww2mxml/lexer.cpp

// This script used to work with Mozilla javascript interpreters (js24...)
// Missing functions may be added at the end of this script for other interpreters
// (done for QuickJS - qjs)

// Usage:
//	JSinterpreter this_file BWW_file > ABC_FILE
// Example:
//	qjs --std ./bww2abc great_tune.bww > great_tune.abc

var grace = {
    // Single Grace notes
	ag: "A",
	bg: "B",
	cg: "c",
	dg: "d",
	eg: "e",
	fg: "f",
	gg: "g",
	tg: "a",

    // Regular Doublings
	dblg: "gGd",
	dbla: "gAd",
	dbb: "gBd",
	dbc: "gcd",
	dbd: "gde",
	dbe: "gef",
	dbf: "gfg",
	dbhg: "gf",
	dbha: "ag",

    // Thumb Doublings
	tdblg: "aGd",
	tdbla: "aAd",
	tdbb: "aBd",
	tdbc: "acd",
	tdbd: "ade",
	tdbe: "aef",
	tdbf: "afg",

    // Half Doublings
	hdblg: "Gd",
	hdbla: "Ad",
	hdbb: "Bd",
	hdbc: "cd",
	hdbd: "de",
	hdbe: "ef",
	hdbf: "fg",
/*
	hdbhg: "gf",
	hdbha: "ag",
*/

    // Single Strikes (same as single grace notes)
	strlg: "G",
	strla: "A",
	strb: "B",
	strc: "c",
	strd: "d",
	stre: "e",
	strf: "f",
	strhg: "g",

    // G Grace note, Thumb and Half Strikes
	gstla: "gAG",
	gstb: "gBG",
	gstc: "gcG",
	gstd: "gdG",
	lgstd: "gec",
	gste: "geA",
	gstf: "gfe",

	tstla: "aAG",
	tstb: "aBG",
	tstc: "acG",
	tstd: "adG",
	ltstd: "adc",
	tste: "aeA",
	tstf: "afe",
	tsthg: "agf",

	hstla: "AG",
	hstb: "BG",	// "BgG",
	hstc: "cG",	// "cgG",
	hstd: "dG",	// "dgG",
	lhstd: "ed",
	hste: "eA",
	hstf: "fe",
	hsthg: "gf",

    // Regular Grips
	grp: "GdG",
	hgrp: "dG",
	grpb: "GBG",

    // G Grace note, Thumb and Half Grips
	ggrpla: "gAGdG",
	ggrpb: "gBGdG",
	ggrpc: "gcGdG",
	ggrpd: "gdGdG",
	ggrpdb: "gdGBG",
	ggrpe: "geGdG",
	ggrpf: "gfGfG",

	tgrpla: "aAGdG",
	tgrpb: "aBGdG",
	tgrpc: "acGdG",
	tgrpd: "adGdG",
	tgrpdb: "adGBG",
	tgrpe: "aeGdG",
	tgrpf: "afGfG",
	tgrphg: "agGfG",

	hgrpla: "AGdG",
	hgrpb: "BGdG",
	hgrpc: "cGdG",
	hgrpd: "dGdG",
	hgrpdb: "dGBG",
	hgrpe: "eGdG",
	hgrpf: "fGfG",
	hgrphg: "gGdG",
	hgrpha: "aGdG",

    // Taorluaths and Bublys
	tar: "GdGe",
	tarb: "GBGe",
	htar: "dGe",
	bubly: "GeGcG",
	hbubly: "dGcG",

    //  Birls
	brl: "GAG",
	abr: "AGAG",
	gbr: "gAGAG",
	tbr: "aAGAG",

    // Light, Heavy and Half D Throws
	thrd: "Gdc",
	hvthrd: "GdGc",
	hthrd: "dc",
	hhvthrd: "dGc",

    // Regular, Thumb Grace Note and Half Peles
	pella: "gAeAG",
	pelb: "gBeBG",
	pelc: "gcecG",
	peld: "gdedG",
	lpeld: "gdedc",
	pele: "gefea",
	pelf: "gfgfe",

	tpella: "aAeAG",
	tpelb: "aBeBG",
	tpelc: "acecG",
	tpeld: "adedG",
	ltpeld: "adedc",
	tpele: "aefeA",
	tpelf: "afgfe",
	tpelhg: "agagf",

	hpella: "AeAG",
	hpelb: "BeBG",
	hpelc: "cecG",
	hpeld: "dedG",
	lhpeld: "dedc",
	hpele: "efeA",
	hpelf: "fgfe",
	hpelhg: "gagf",

    // Regular Double Strikes
	st2la: "GAG",
	st2b: "GBG",
	st2c: "GcG",
	st2d: "GdG",
	lst2d: "cdc",
	st2e: "AeA",
	st2f: "efe",
	st2hg: "fgf",
	st2ha: "gag",

    // G Grace note, Thumb and Half Double Strikes
	gst2la: "gAGAG",
	gst2b: "gBGBG",
	gst2c: "gcGcG",
	gst2d: "gdGdG",
	lgst2d: "gdcdc",
	gst2e: "geAeA",
	gst2f: "gfefe",

	tst2la: "aAGAG",
	tst2b: "aBGBG",
	tst2c: "acGcG",
	tst2d: "adGdG",
	ltst2d: "adcdc",
	tst2e: "aeAeA",
	tst2f: "afefe",
	tst2hg: "agfgf",

	hst2la: "AGAG",
	hst2b: "BGBG",
	hst2c: "cGcG",
	hst2d: "dGdG",
	lhst2d: "dcdc",
	hst2e: "eAeA",
	hst2f: "fdfd",
	hst2hg: "gfgf",
	hst2ha: "agag",

    // Regular Triple Strikes
	st3la: "GAGAG",
	st3b: "GBGBG",
	st3c: "GcGcG",
	st3d: "GdGdG",
	lst3d: "cdcdc",
	st3e: "AeAeA",
	st3f: "efefe",
	st3hg: "fgfgf",
	st3ha: "gagag",

    // G Grace note, Thumb and Half Triple Strikes
	gst3la: "gAGAGAG",
	gst3b: "gBGBGBG",
	gst3c: "gcGcGcG",
	gst3d: "gdGdGdG",
	lgst3d: "gdcdcdc",
	gst3e: "geAeAeA",
	gst3f: "gfefefe",

	tst3la: "aAGAGAG",
	tst3b: "aBGBGBG",
	tst3c: "acGcGcG",
	tst3d: "adGdGdG",
	ltst3d: "adcdcdc",
	tst3e: "aeA2AeA",
	tst3f: "afefefe",
	tst3hg: "agfgfgf",

	hst3la: "AGAGAG",
	hst3b: "BGBGBG",
	hst3c: "cGcGcG",
	hst3d: "dGdGdG",
	lhst3d: "dcdcdc",
	hst3e: "eAeAEA",
	hst3f: "fefefe",
	hst3hg: "gfgfgf",
	hst3ha: "agagag",

    // Double Grace notes
	dlg: "dG",
	dla: "dA",
	db: "dB",
	dc: "dc",
	elg: "eG",
	ela: "eA",
	eb: "eB",
	ec: "ec",
	ed: "ed",

	flg: "fG",
	fla: "fA",
	fb: "fB",
	fc: "fc",
	fd: "fd",
	fe: "fe",

	glg: "gG",
	gla: "gA",
	gb: "gB",
	gc: "gc",
	gd: "gd",
	ge: "ge",
	gf: "gf",

	tlg: "aG",
	tla: "aA",
	tb: "aB",
	tc: "ac",
	td: "ad",
	te: "ae",
	tf: "af",
	thg: "ag",

	// cadences
	cadged: "ge4d",
	cadge: "ge4",
	caded: "e4d",
	cade: "e4",
	cadaed: "ae4d",
	cadae: "ae4",

	fcadged: "gHe4d",
	fcadge: "gHe4",
	fcaded: "He4d",
	fcade: "He4",
	fcadaed: "aHe4d",
	fcadae: "aHe4",

	cadgf: "gf4",
	cadaf: "af4",
	fcadgf: "gHf4",
	fcadaf: "aHf4",

	// E, F and High G Throws
	embari: "eAfA",
	endari: "fege",
	chedari: "geae",	// ??
//	hedari: "???",

	// High A and D Throws
	dili: "ag",
	tra: "G2dc",
	htra: "dc",
	tra8: "G2dc",

	// G Grace note, Thumb and Half Throws
	gedre: "geAfA",
	gdare: "gfege",
	tedre: "aeAfA",
	tdare: "afege",
	tchechere: "ageae",
	dre: "AfA",
	hedale: "ege",
	hchechere: "eae",

	// Grips
//	grp: "GdG",
	deda: "GeG",

	// Echo Beat Grace notes
	echolg: "G2",
	echola: "A2",
	echob: "B2",
	echoc: "c2",
	echod: "d2",
	echoe: "e2",
	echof: "f2",
	echohg: "g2",
	echoha: "a2",

	darodo: "GdGcG",
	darodo16: "G2dGcG2",
	hdarodo: "dGcG",

	hiharin: "dAGAG",
	rodin: "GBG",
	chelalho: "f4de",
	din: "G2"
}

var deco = {
	pembari: "P",
	pendari: "P",
	pechedari: "P",
	pehedari: "P",

	pdili: "!trill!",
	ptra: "!trill!",
	phtra: "!trill!",
	ptra8: "!trill!",

	pgrp: "!trill!",

	pdarodo: "!turn!",
	pdarodo16: "!turn!",
	phdarodo: "!turn!",

	phiharin: "P",

	fine: "!fine!y",
	dacapoalfine: "!D.C.alfine!y",
	coda: "O",
	dacapoalcoda: "!D.C.alcoda!y",
	codasection: "O"
}

//
// Convert a single BWW tune to ABC
//
function convert_bww_to_abc_single(theBWW) {

    var	i, j, l, low, t, n, key, tie, acc, beam, fermata, o = '';

	var p = theBWW.split('\n');

	accum = "X:1\n% Converted to ABC using bww2abc 1.0\n%%MIDI program 109\n%%staffsep 70\n";

	// header
	for (i = 0; i < p.length; i++) {
		l = p[i].trim()
		if (!l)
			continue
		switch (l[0]) {
		default: continue
		case '"':
			j = l.indexOf('"', 1)
			if (j <= 0)
				continue
			t = l.slice(1, j)
			if (!t)
				continue
			if (l[j + 1] != ',') {
				accum = accum +('% ' + t+ "\n")
				continue
			}
			switch (l[j + 3]) {
			case 'T':
				accum = accum +('T:' + t + "\n")
				continue 
			case 'M':
				accum = accum +('C:' + t+ "\n")
				continue 
			case 'Y':
				accum = accum +('R:' + t+ "\n")
				continue 
			case 'F':
				accum = accum +('%%footer \t' + t+ "\n")
				continue 
			}
			continue
		case 'T':
			t = l.split(',')
			if (t[0] == 'TuneTempo')
				accum = accum +('Q:1/4=' + t[1]+ "\n")
			continue
		case '&':			// clef = start of music
		//debugger;

			//get the accidentals
			t = l.split(/\s+/);
			key = ''
			for (j = 0; j < t.length; j++) {
				l = t[j].match(/(sharp|flat|natural)(.)/)
				if (!l)
					continue
				if (key)
					key += ' '
				switch (l[1]) {
				case 'sharp':
					key += '^'
					break
				case 'flat':
					key += '_'
					break
				default:
					key += '='
					break
				}
				switch (l[2]) {
				case 'hg':
					key += 'g'
					break
				case 'ha':
					key += 'a'
					break
				case 'lg':
					key += 'G'
					break
				case 'la':
					key += 'A'
					break
				default:
					key += l[2]
					break
				}
			}

			// get the measure
			t = t[t.length - 1]	// the measure is the last word
			if (!/(C|C_|\d+_\d+)/.test(t)) { // or in the next line
				l = p[++i].trim();
				t = l.split(/\s+/)[0]
				if (!/(C|C_|\d+_\d+)/.test(t)) {
					accum = accum +('M:2/4')+ "\n"
					break
				}
			}
			if (t == 'C_')
				accum = accum +('M:C|')+ "\n"
			else
				accum = accum +('M:' + t.replace('_', '/'))+ "\n";
			i++
			break
		}
		break
	}

	accum = accum +('L:1/8\nK:Hp exp ' + key +" transpose=1")+ "\n"; 
	accum = accum + "%voice_tuning_cents 48 148\n";

	// Parse the music
	for ( ; i < p.length; i++) {
		l = p[i]
		if (!l || l[0] == '&')
			continue
		l = l.trim().split(/\s+/)
		for (j = 0; j < l.length; j++) {
			t = l[j];
			low = false;
			switch (t[0]) {
			case "'":
				switch (t) {
				case "''!I":
					accum = accum +(o +  ' :|')+ "\n";
					o = ''
					continue
				case "'intro":
					o += '["Introduction"'
					continue
				}

				// "'[0-9]+" = repeat
				o += '[';
				t = t.slice(1)
				if (t.length == 1) {
					o += t
				} else if (t.length == 2) {
					o += '"' + t[0] + ' of ' + t[1] + '"'
				} else {
					o += '"' + t[0] + ' of ' + t[1] +
						' & ' + t[2] + '"'
				}
				continue
			case "_":
				o += ']'
				continue
			case '!':
				switch (t) {
				case '!t':
					accum = accum +(o + ' |')+ "\n";
					o = ''
					continue
				case '!!t':
					accum = accum +(o + ' ||')+ "\n";
					o = ''
					continue
				case '!I':
					accum = accum +(o + ' |]')+ "\n";
					o = ''
					continue
				}
				o += '| '
				continue
			case 'I':
				switch (t) {
				case "I!''":
					o += '|: '
					continue
				case "I!":
					o += '|| '
					continue
				}
				continue
			case 'H':
				low = false;
				t = t.slice(1)
				break
			case 'L':
				low = true;
				t = t.slice(1)
				break
			case 'R':
				o += 'z';
				u = t.replace('REST_', '')
				switch (Number(u)) {
				case 1: o += '8'; break
				case 2: o += '4'; break
				case 4: o += '2'; break
//				case 8: o += ''; break
				case 16: o += '/'; break
				case 32: o += '//'; break
				}
				continue
			case '^':
				switch (t[1]) {
				case 't':		// tie 
					if (t[2] == 's')	// new format
						tie = true
					// if (t[2] != 'e')	// MAE 26 May 2024 - Commented out, was causing playback issues
					//  	o += '-'
//					else
//						conflict
					break
				case '2':		// duplet
				case '3':		// triplet
					if (t[2] == 'e')
						break
					o += '(' + t[1]
					break
				case '4':
				case '5':
				case '6':
				case '7':
					if (t[2] == 'e')
						break
					o += '(' + t[1][0] + ':' + t[1][1]
					break
				}
				continue
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '9':
				if (/\d+_\d+/.test(t)) {
					o += '[M:' + t.replace('_', '/') + ']'
					continue
				}
				break
			case 'C':
				switch (t) {
				case 'C':
					o += '[M:C]'
					continue
				case 'C_':
					o += '[M:C|]'
					continue
				}
				break
			case 'T':
				u = t.split(',')
				if (u[0] == 'TuneTempo') {
					o += '[Q:1/4=' + u[1] + ']'
					continue
				}
				break
			}
			u = t.match(/([ABCDEFG])([rl]?)_(\d+)/)
			if (!u) {
				if (grace[t]) {
					o += '{'+ grace[t] + '}'
					continue
				}
				if (deco[t]) {
					o += deco[t]
					continue
				}

				//fixme
				if(!t[j]){
					//console.log('t:'+t);
					continue;
				}
				else{

					u = t[j].match(/(sharp|flat|natural)(.)/)
					if (u) {
						switch(u[1]) {
						case 'sharp':
							acc = '^'
							break
						case 'flat':
							acc = '_'
							break
						default:
							acc = '='
							break
						}
						continue
					}
				}

				//console.log('*** ' + t + ' not found ***')
				continue
			}

			if (acc) {			// accidental
				o += acc;
				acc = ''
			}
			if (j < l.length - 1
			 && /fermat/.test(l[j + 1])) {	// fermata
				fermata = true;
				o += 'H'
			}

			if (u[1] == 'B')
				low = true;

			o += low ? u[1] : u[1].toLowerCase()
			if (j < l.length - 1
			 && /''?[abcdefghl]/.test(l[j + 1])) {	// dot(s)
				if (l[++j][1] == "'") {
					switch (Number(u[3])) {
					case 1: o += '14'; break
					case 2: o += '7'; break
					case 4: o += '7/'; break
					case 8: o += '7//'; break
					case 16: o += '7///'; break
					case 32: o += '7////'; break
					}
				} else {
					switch (Number(u[3])) {
					case 1: o += '12'; break
					case 2: o += '6'; break
					case 4: o += '3'; break
					case 8: o += '3/'; break
					case 16: o += '3//'; break
					case 32: o += '3///'; break
					}
				}
			} else {
				switch (Number(u[3])) {
				case 1: o += '8'; break
				case 2: o += '4'; break
				case 4: o += '2'; break
//				case 8: o += ''; break
				case 16: o += '/'; break
				case 32: o += '//'; break
				}
			}
			if (tie) {
				o += '-';
				tie = false
			}
			if (Number(u[3]) >= 8) {	// if a stem
				switch (u[2]) {
				case 'l':
					beam = false
					break
				case 'r':
					beam = true
					break
				}
				if (!beam)
					o += ' '
			}
			if (fermata) {
				j++;
				fermata = false
			}
		}
	}

	return accum;
} 

//
// If there are multiple tunes in the BWW, split them up and convert individually
//
function convert_bww_to_abc(theBWW){
	
	//debugger; 

  	// Replace occurrences of Bagpipes Reader and Bagpipe Music Writer Gold at the start of a line with "Bagpipes Music Writer"

	var regex = /^Bagpipe Reader/gm;

  	theBWW = theBWW.replace(regex, 'Bagpipe Music Writer');

  	regex = /^Bagpipe Music Writer Gold/gm;

  	theBWW = theBWW.replace(regex, 'Bagpipe Music Writer');

	var theBWWTunes = theBWW.split("Bagpipe Music Writer");

	var nBWWTunes = theBWWTunes.length;

	var accum = "";

	for (var i=0;i<nBWWTunes;++i){

		// Some BWW files have multiple tool information lines, skip the bad splits
		var lines = theBWWTunes[i].split(/\r\n|\r|\n/);
	
		if ((theBWWTunes[i] != "") && (lines.length > 3)){

			accum += convert_bww_to_abc_single("Bagpipe Music Writer"+theBWWTunes[i]);

			accum += "\n";

		}
	}
	
	return accum;

}
