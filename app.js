	// Se define la función para dibujar el gráfico de barras
	// Descargar los datos desde el archivo bd.csv, se debe volver a colocar la base, reescribiendola para que se ejecute la gráfica
	function graficobarras(){
		d3.csv("bd.csv", function (d, i, columns) {
		// += "Suma a t el valor d[columns[j]]"
		// Agregamos una columna total y otra del orden de las paradas
			for (j = 1, t = 0; j < columns.length; ++j) t += d[columns[j]] = +d[columns[j]]; // t = t + d[columns[j]]
			d.total = t;
			d.ordenparada = i + 1;
			return d;
			},
		// La función de dibujar el gráfico.
			function (datos) {
				dibujar(datos);
            });                   
	};
		
	function dibujar(datos){
	// Definir el tamaño del area dentro del svg y el grupo. 
	// Ademas se trasladar el eje de cordenadas los margenes.
		var svg = d3.select("#graficobarras")
					.append("svg:svg")
					.attr("width", 960)          
					.attr("height", 590) // Porque aquí no lleva una coma?
			margin = {top: 20, right: 20, bottom: 120, left: 40},
			width = +svg.attr("width") - margin.left - margin.right,
			height = +svg.attr("height") - margin.top - margin.bottom,
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Definir el eje x como una escala por bandas y distribuirla
		var x = d3.scaleBand()
				  .rangeRound([0, width])
				  .paddingInner(0.05)
				  .align(0.1);

	// Definir el eje y como una escala lineal y distribuirla
		var y = d3.scaleLinear()
				  .rangeRound([height, 0]);

	// Definir el eje y como una escala ordinal se definen una serie de colores
		var z = d3.scaleOrdinal()
				  .range(["#ff9999", "#9fff80", "#ff80ff", "#c299ff"]);

	// Con la función js slice, sacamos las claves que son los años que están en la cabecera menos la parada.
		var claves = datos.columns.slice(1);
	
	// Usamos la función map para que devuelva las Paradas en x
		x.domain(datos.map(function(d) { return d.Parada; }));
	// Aquí usamos el valor máximo del total para el y
		y.domain([0, d3.max(datos, function(d) { return d.total; })]).nice();
	// Usamos la escala z donde para clave año hay un color.
		z.domain(claves);

	// Generamos el grupo g para las barrar apiladas
		g.append("g")
		 .selectAll("g")
	// Generamos el stack a partir de los datos y diciendole las keys
	// Genera un array con un elemento por serie que tiene a su vez elementos 
		 .data(d3.stack().keys(claves)(datos))
	// Se genera un grupo por cada uno de los años y se le asigna el color correspondiente
		 .enter().append("g")
		 .attr("fill", function(d) { return z(d.key); })
		 .attr("class", "año")
	// Y se generan los rectangulos
		 .selectAll("rect")
		 .data(function(d) { return d; })
		 .enter().append("rect")
		 .attr("x", function(d) { return x(d.data.Parada); })
		 .attr("y", function(d) { return y(d[1]); })
		 .attr("height", function(d) { return y(d[0]) - y(d[1]); })
		 .attr("width", x.bandwidth());
	// Se genera un grupo para el eje x  
		g.append("g")
		 .attr("class", "axis")
		 .attr("transform", "translate(0," + height + ")")
		 .call(d3.axisBottom(x))
		 .selectAll("text")
		 .style("text-anchor", "start")
		 .attr("dx", "1em")
		 .attr("dy", "-0.7em")
		 .attr("transform", "rotate(90)");
	//
		g.append("g")
		 .attr("class", "axis")
		 .call(d3.axisLeft(y).ticks(null, "s"))
		 .append("text")
		 .attr("x", 2)
		 .attr("y", y(y.ticks().pop()) + 0.5)
		 .attr("dy", "0.32em")
		 .attr("fill", "#000")
		 .attr("font-weight", "bold")
		 .attr("text-anchor", "start")
		 .text("% ocupacion");
	// Se genera la leyenda
		var legend = g.append("g")
					  .attr("font-family", "sans-serif")
					  .attr("font-size", 10)
					  .attr("text-anchor", "end")
					  .selectAll("g")
					  .data(claves.slice().reverse())
					  .enter().append("g")
					  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			  .attr("x", width - 19)
			  .attr("width", 19)
			  .attr("height", 19)
			  .attr("fill", z);

		legend.append("text")
			  .attr("x", width - 24)
			  .attr("y", 9.5)
			  .attr("dy", "0.32em")
			  .text(function(d) { return d; });

	// Botones
		var botones = d3.select("div#botones");
            botones.append("button")
                   .attr("class", "boton")
                   .on("click", function() { sort("porParada");}) 
                   .text("Orden Hotel");


            botones.append("button")
                   .attr("class", "boton")
                   .on("click", function() { sort("porTotal");})
                   .text("Orden ocupacion Totales");
                
           
	// Funciones Ordenar
        function sort(orden){
                    if (orden == "porParada"){
                        datos = datos.sort(function (a, b) {
                                return a.ordenparada - b.ordenparada;
                            });
                    }
                    else if (orden == "porTotal"){
                        datos = datos.sort(function (a, b) {
                            return b.total - a.total;
                            });
						
                    }
                    else {
                        datos = datos.sort(function (a, b) {
                            return b[2016] - a[2016];
                            });
                    };
                
                    d3.select("svg").remove();
                    d3.selectAll("button").remove();
                    dibujar(datos);

                };
			  
			  
			  
};
