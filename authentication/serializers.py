from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers, status

from rest_framework.response import Response

from authentication.models import Account

class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Account
        fields = ('id',
                  'email',
                  'username',
                  'created_at',
                  'updated_at',
                  'first_name',
                  'last_name',
                  'tagline',
                  'password',
                  'confirm_password'
        )
        #The created_at and updated_at fields are self-updating and that's why they are added to the list of read-only.
        read_only_fields = ('created_at', 'updated_at')


    def create(self, validated_data):
        return Account.objects.create(**validated_data)

    #Here instance of type Account
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.tagline = validated_data.get('tagline', instance.tagline)

        instance.save()

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and confirm_password and password == confirm_password:
            instance.set_password(password)
            instance.save()
        else:
            return Response({}, status=status.HTTP_204_NO_CONTENT)


        update_session_auth_hash(self.context.get('request'), instance)

        return instance