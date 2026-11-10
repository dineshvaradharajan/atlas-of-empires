# Storyboard: American Civil War (`content/cinema/american-civil-war.json`)

Sides follow `content/wars/b-modern.json`: **0 = Union, 1 = Confederacy**.

## Chapters (12) and why
1. **Secession and Fort Sumter** (4 Feb – 8 Jun 1861): the Confederacy formed; Virginia (17 Apr), Arkansas (6 May), North Carolina (20 May) and Tennessee (8 Jun) join after Sumter.
2. **Bull Run and western Virginia** (May – Jul 1861).
3. **The rivers of the West, 1862**: Henry and Donelson, Nashville, Island No. 10, Shiloh, New Orleans, Corinth, Memphis, Helena.
4. **The Peninsula campaign** (Mar – Jul 1862).
5. **Second Bull Run and Antietam** (Aug – Sep 1862).
6. **Fredericksburg and Chancellorsville** (Dec 1862 – May 1863).
7. **Vicksburg** (Mar – Jul 1863, with Port Hudson).
8. **Gettysburg** (Jun – Jul 1863). The brief's "Vicksburg and Gettysburg 1863" is split because each chapter frames one place.
9. **Tullahoma, Chickamauga and Chattanooga** (Jun – Nov 1863, with Knoxville).
10. **The Overland campaign and Petersburg** (May – Oct 1864, with Early's raid and Sheridan's Valley campaign).
11. **Atlanta and the March to the Sea** (May – Dec 1864).
12. **The Carolinas and Appomattox** (Feb – 26 May 1865).

## How the map is built (important)
Contrary to the assumption in the request, the base map **does** draw the Confederate States each year (one shape per year, roughly the end-of-year extent). The storyboard therefore paints *who held what on each date* and lets the engine correct the base map both ways:
- The Confederacy is the 1861 base map's Confederate States; Union-held ground inside it (western Virginia, northern Virginia, the Peninsula and Norfolk, the North Carolina sounds, Port Royal, the Florida coast and Pensacola, Tennessee and the Mississippi valley, New Orleans and Louisiana, Arkansas, Chattanooga–Knoxville, Sherman's paths through Georgia and the Carolinas, Petersburg, Mobile) is drawn as Union areas that grow over time; Confederate incursions (Kentucky 1861–62 and 1862, Maryland 1862, Pennsylvania 1863, Early's raid 1864) and besieged pockets (Vicksburg, Port Hudson) are drawn as Confederate areas.
- These keyframes are rasterised (0.025°) and compared with the corrected base map of each year: Union rings appear where the base map still shows the Confederacy, Confederate rings where it already shows the Union. Tracks are followed from date to date automatically, so the Union-controlled Mississippi and the shrinking Confederacy read continuously across the yearly base-map switch.
- States that had not yet seceded are explicit Union rings until their secession dates.
- No fronts (there was no continuous front).

## Maps traced
- *The Civil War 1864–1865* historical atlas plate (Commons), *Western Theater of the American Civil War* overview and *Savannah Campaign* (Hal Jespersen, Commons).
- Campaign geography and dates from the cited Wikipedia articles (secession dates from the Confederate States article; captures from each battle/campaign article). Casualties from Wikipedia's *List of costliest American Civil War land battles* and the infoboxes of Fort Donelson, Seven Days, Vicksburg, Port Hudson, Appomattox and First Bull Run.

## Uncertainties
- Control lines are judgement calls at roughly 20–50 km: interior control in Tennessee, Arkansas and Virginia shifted with raids and guerrillas, which are not shown.
- Sherman's 60-mile-wide paths through Georgia and the Carolinas are shown as Union-held after his armies passed, though they were not garrisoned.
- Not drawn: the Texas coast (Galveston 1862–63, Brownsville 1863–64), the Red River campaign, Confederate Arizona's loss is simplified to July 1862, Price's 1864 Missouri raid, Hood's late-1864 Tennessee campaign appears only as a temporary pull-back of the Union area to Nashville (no chapter).
- Kentucky and Missouri have no state on the 1861 base map, so the Confederate hold on southern Kentucky in autumn 1861 is drawn from January 1862.

## Warnings left
15 "pocket" warnings (600–2,470 km²), all of them real enclaves or salients rather than drawing gaps: Union enclaves (Norfolk–Fort Monroe, Northern Neck/Fredericksburg line, Harpers Ferry, the Louisiana river parishes, the Big Black–Jackson area, Cumberland Gap) inside Confederate country, and Confederate country left between Sherman's swath, the Carolina coast and the Union-held North Carolina sounds in March 1865. Larger ones are explained by sourced claims (Baton Rouge, Milliken's Bend, Norfolk).

## Counts
12 chapters; 77 claims, all passing; 0 fronts; 82 occupation tracks (incl. 4 pre-secession rings); 48 arrows; 24 battles; 14 sources.
