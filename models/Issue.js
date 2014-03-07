global.models.Issue = global.backbone.Model.extend({
    nombre: 'hola',
    diHola: function(){
        console.log(this.nombre);
    }
});