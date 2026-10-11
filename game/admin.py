from django.contrib import admin
from .models import Word


@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ("word", "active", "note", "created_at")
    list_filter = ("active",)
    search_fields = ("word", "note")
    list_editable = ("active",)
    ordering = ("id",)
    fieldsets = ((None, {"fields": ("word", "note", "active")}),)
