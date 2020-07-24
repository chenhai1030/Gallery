from rest_framework import serializers
from waterfall.models import Waterfall


class WaterfallSerializer(serializers.HyperlinkedModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    # name = serializers.CharField(required=True, allow_blank=True, max_length=255)
    # src = serializers.CharField()
    # style = serializers.CharField()
    # type = serializers.CharField()
    #
    # def create(self, validated_data):
    #     """
    #     Create and return a new `Image` instance, given the validated data.
    #     """
    #     return Image.objects.create(**validated_data)
    #
    # def update(self, instance, validated_data):
    #     """
    #     Update and return an existing `Image` instance, given the validated data.
    #     """
    #     instance.id = validated_data.get('id', instance.id)
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.style = validated_data.get('style', instance.style)
    #     instance.type = validated_data.get('type', instance.type)
    #     instance.save()
    #     return instance
    class Meta:
        model = Waterfall
        fields = ('id', 'img_name', 'create_time', 'src', 'style', 'type')
