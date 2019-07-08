import P5			from 'p5';
import { Bird }		from './bird';
import { Dna }		from './dna';
declare const p5:P5;

export class Population {
	birds:Bird[];
	generation = 1;
	bestDist = 0;

	constructor(public size:number) {
		this.createBirds();
	}

	createBirds() {
		this.birds = Array.from({length:this.size}).map((u,i) => {
			return new Bird(p5.createVector(25, p5.height/2));
		});
	}


	nextGen() {
		this.generation++;
		this.calcNormFitness();
		var newDnas = this.birds.map(entity => {
			var a = this.randomWeighted();
			var b = this.randomWeighted();
			// console.log('nextGen: a=%o, b=%o', a,b);
			var dna = Dna.crossover(a.dna,b.dna);
			dna.mutate(0.01, 0.1);
			return dna;
		});
		this.createBirds();
		this.birds.forEach((bird,i) => {
			bird.dna = newDnas[i];
			bird.applyDna();
		});
	}

	calcFitness() {
		this.birds.forEach(entity => {
			entity.calcFitness();
		});
		this.birds = this.birds.sort((a,b) => b.fitness-a.fitness);
	}
	calcNormFitness() {
		var total = this.birds.map(r => r.fitness).reduce((a,b) => a+b, 0);
		this.birds.forEach(r => r.normFitness=r.fitness/total);
	}

	randomWeighted() {
		var r = p5.random(0,1);
		for(var i=0;i<this.birds.length;i++) {
			if(r<this.birds[i].normFitness) return this.birds[i];
			r -= this.birds[i].normFitness;
		}
	}
}
