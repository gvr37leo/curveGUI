class CurveGUI{
    constructor(querystring){
        this.selected = null;
        this.width = 10;
        var template = `
            <div id='gui' style="border: 1px solid black; display: inline-block">
                <canvas id='canvas' style="display:block"></canvas>
            </div>
        `

        // var wrapper = document.createElement('div')
        // wrapper.innerHTML = template;
        // var dom = wrapper.firstChild

        var parser = new DOMParser();
        this.dom = parser.parseFromString(template, "text/html").body;
        this.html = this.dom.querySelector('#gui')
        this.canvas = this.dom.querySelector('#canvas')
        var width = 200
        var height = 200
        this.canvas.width = width
        this.canvas.height = height
        this.controlPoints = [new Vector2(0,height),new Vector2(width / 4, height / 4),new Vector2(width * 0.75, width * 0.75),new Vector2(width,0)]
        this.curve = Bezier.path(this.controlPoints)
        this.ctxt = this.canvas.getContext('2d')

        document.addEventListener('mousemove', (e) => {
            var mousepos = getMousePos(this.canvas, e)
            if(this.selected){
                this.selected.overwrite(mousepos)
                this.selected.clamp(width, height)
                this.curve = Bezier.path(this.controlPoints)
                this.draw()
            }
        })

        this.canvas.addEventListener('mousedown', (e) => {
            var mousepos = getMousePos(this.canvas, e);
            console.log(mousepos)
            var closest = null;
            for(var point of this.controlPoints){
                if(closest == null){
                    closest = point
                    continue;
                }
                if(mousepos.dist(point) < mousepos.dist(closest)){
                    closest = point
                }
            }
            this.selected = closest
            closest.overwrite(mousepos)
            this.selected.clamp(width, height)
            this.curve = Bezier.path(this.controlPoints)
            this.draw();
        })

        document.addEventListener('mouseup', (e) => {
            this.selected = null;
        })

        this.draw()

        document.querySelector(querystring).appendChild(this.dom)
    }

    draw(){
        this.ctxt.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctxt.beginPath();
        for(var point of this.curve){
            this.ctxt.lineTo(point.x, point.y)
        }
        this.ctxt.stroke()

        for(var point of this.controlPoints){
            point.draw(this.ctxt)
        }
    }
}

var curve = new CurveGUI('#container');