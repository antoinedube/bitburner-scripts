/** @param {NS} ns */
async function setSleevesTask(ns) {
    for (var i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        const sleeve = ns.sleeve.getSleeve(i);
        ns.print(`Sleeve ${i} has:`);
        ns.print(`- sync=${sleeve.sync}`);
        ns.print(`- shock=${sleeve.shock}`);
        ns.print(`--------------------------------------------`);
        if (sleeve.sync < 100) {
            ns.print('Synchronize');
            ns.sleeve.setToSynchronize(i);
        }
        else if (sleeve.shock > 0) {
            ns.print('Shock recovery');
            ns.sleeve.setToShockRecovery(i);
        }
        else {
            ns.print('Manual task');
            // Ref: https://github.com/danielyxie/bitburner/blob/dev/src/Enums.ts
            // ns.sleeve.setToCommitCrime(i, 'Assassination');
            // ns.sleeve.setToCommitCrime(i, 'Heist');
            ns.sleeve.setToCommitCrime(i, 'Mug');
            // ns.sleeve.setToCommitCrime(i, 'Homicide');
            // ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Computer Science');
            // ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Algorithms');
        }
    }
}
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');
    while (true) {
        await setSleevesTask(ns);
        await ns.sleep(1000 * 15);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlLXNsZWV2ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zY3JpcHRzL21hbmFnZS1zbGVldmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixLQUFLLFVBQVUsY0FBYyxDQUFDLEVBQUU7SUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFFekQsSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRTtZQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7YUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUMzQixFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDTCxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hCLHFFQUFxRTtZQUNyRSxrREFBa0Q7WUFDbEQsMENBQTBDO1lBQzFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLDZDQUE2QztZQUM3QyxnRkFBZ0Y7WUFDaEYsMEVBQTBFO1NBQzNFO0tBQ0Y7QUFDSCxDQUFDO0FBRUQscUJBQXFCO0FBQ3JCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQUU7SUFDM0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2QixPQUFPLElBQUksRUFBRTtRQUNYLE1BQU0sY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDM0I7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBwYXJhbSB7TlN9IG5zICovXG5hc3luYyBmdW5jdGlvbiBzZXRTbGVldmVzVGFzayhucykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5zLnNsZWV2ZS5nZXROdW1TbGVldmVzKCk7IGkrKykge1xuICAgIGNvbnN0IHNsZWV2ZSA9IG5zLnNsZWV2ZS5nZXRTbGVldmUoaSk7XG4gICAgbnMucHJpbnQoYFNsZWV2ZSAke2l9IGhhczpgKTtcbiAgICBucy5wcmludChgLSBzeW5jPSR7c2xlZXZlLnN5bmN9YCk7XG4gICAgbnMucHJpbnQoYC0gc2hvY2s9JHtzbGVldmUuc2hvY2t9YCk7XG4gICAgbnMucHJpbnQoYC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYCk7XG5cbiAgICBpZiAoc2xlZXZlLnN5bmMgPCAxMDApIHtcbiAgICAgIG5zLnByaW50KCdTeW5jaHJvbml6ZScpO1xuICAgICAgbnMuc2xlZXZlLnNldFRvU3luY2hyb25pemUoaSk7XG4gICAgfSBlbHNlIGlmIChzbGVldmUuc2hvY2sgPiAwKSB7XG4gICAgICBucy5wcmludCgnU2hvY2sgcmVjb3ZlcnknKTtcbiAgICAgIG5zLnNsZWV2ZS5zZXRUb1Nob2NrUmVjb3ZlcnkoaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5zLnByaW50KCdNYW51YWwgdGFzaycpO1xuICAgICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vZGFuaWVseXhpZS9iaXRidXJuZXIvYmxvYi9kZXYvc3JjL0VudW1zLnRzXG4gICAgICAvLyBucy5zbGVldmUuc2V0VG9Db21taXRDcmltZShpLCAnQXNzYXNzaW5hdGlvbicpO1xuICAgICAgLy8gbnMuc2xlZXZlLnNldFRvQ29tbWl0Q3JpbWUoaSwgJ0hlaXN0Jyk7XG4gICAgICBucy5zbGVldmUuc2V0VG9Db21taXRDcmltZShpLCAnTXVnJyk7XG4gICAgICAvLyBucy5zbGVldmUuc2V0VG9Db21taXRDcmltZShpLCAnSG9taWNpZGUnKTtcbiAgICAgIC8vIG5zLnNsZWV2ZS5zZXRUb1VuaXZlcnNpdHlDb3Vyc2UoaSwgJ1JvdGhtYW4gVW5pdmVyc2l0eScsICdDb21wdXRlciBTY2llbmNlJyk7XG4gICAgICAvLyBucy5zbGVldmUuc2V0VG9Vbml2ZXJzaXR5Q291cnNlKGksICdSb3RobWFuIFVuaXZlcnNpdHknLCAnQWxnb3JpdGhtcycpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zKSB7XG4gIG5zLmRpc2FibGVMb2coJ3NsZWVwJyk7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBhd2FpdCBzZXRTbGVldmVzVGFzayhucyk7XG5cbiAgICBhd2FpdCBucy5zbGVlcCgxMDAwICogMTUpO1xuICB9XG59XG4iXX0=