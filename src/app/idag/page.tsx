"use client";

import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { loadLeads } from "@/lib/leads/storage";
import { Lead } from "@/lib/leads/types";
import { 
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  User,
  Building,
  Plus,
  Search,
  Filter
} from "lucide-react";

interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  leadKommun: string;
  type: 'call' | 'email' | 'meeting' | 'quote_followup';
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function IdagPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    leadId: '',
    type: 'call' as FollowUpTask['type'],
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '09:00',
    priority: 'medium' as FollowUpTask['priority']
  });

  useEffect(() => {
    // Load leads and generate sample follow-up tasks
    const loadedLeads = loadLeads();
    setLeads(loadedLeads);
    
    // Generate sample tasks for demo
    const sampleTasks: FollowUpTask[] = loadedLeads.slice(0, 5).map((lead, index) => ({
      id: `task-${index}`,
      leadId: lead.id,
      leadName: lead.name,
      leadKommun: lead.kommun,
      type: ['call', 'email', 'meeting', 'quote_followup'][index % 4] as FollowUpTask['type'],
      title: [
        'Uppföljning efter offert',
        'Kontakta angående demo',
        'Boka möte',
        'Fråga efter feedback'
      ][index],
      description: [
        'Kolla om de har några frågor om offerten',
        'Visa dem hur Ticko kan hjälpa deras företag',
        'Diskutera deras behov och presentera lösningen',
        'Se om de är intresserade av att gå vidare'
      ][index],
      dueDate: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueTime: ['09:00', '10:30', '14:00', '15:30'][index],
      priority: ['high', 'medium', 'low', 'medium'][index] as FollowUpTask['priority'],
      status: index === 0 ? 'completed' : 'pending' as FollowUpTask['status'],
      createdAt: new Date().toISOString()
    }));
    
    setTasks(sampleTasks);
  }, []);

  const addTask = () => {
    if (!newTask.leadId || !newTask.title) return;
    
    const lead = leads.find(l => l.id === newTask.leadId);
    if (!lead) return;
    
    const task: FollowUpTask = {
      id: Date.now().toString(),
      leadId: newTask.leadId,
      leadName: lead.name,
      leadKommun: lead.kommun,
      type: newTask.type,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      priority: newTask.priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      leadId: '',
      type: 'call',
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      priority: 'medium'
    });
    setShowAddTask(false);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
  };

  const cancelTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'cancelled' } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = search === '' || 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.leadName.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || task.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: FollowUpTask['type']) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'quote_followup': return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: FollowUpTask['type']) => {
    switch (type) {
      case 'call': return 'Telefonsamtal';
      case 'email': return 'E-post';
      case 'meeting': return 'Möte';
      case 'quote_followup': return 'Offertuppföljning';
    }
  };

  const getPriorityColor = (priority: FollowUpTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
  };

  const getStatusColor = (status: FollowUpTask['status']) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    }
  };

  const getStatusText = (status: FollowUpTask['status']) => {
    switch (status) {
      case 'pending': return 'Väntar';
      case 'completed': return 'Slutförd';
      case 'cancelled': return 'Avbruten';
    }
  };

  const todayTasks = filteredTasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0]);
  const upcomingTasks = filteredTasks.filter(task => task.dueDate > new Date().toISOString().split('T')[0]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dagens uppföljningar</h1>
            <p className="text-muted-foreground">Håll koll på dina kundkontakter och följ upp offerter</p>
          </div>
          <Button onClick={() => setShowAddTask(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Ny uppföljning
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{todayTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Idag</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Väntande</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</p>
                  <p className="text-sm text-muted-foreground">Slutförda</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{upcomingTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Kommande</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Sök uppgifter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'completed') => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="pending">Väntande</SelectItem>
              <SelectItem value="completed">Slutförda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Idag ({new Date().toLocaleDateString('sv-SE')})
            </h2>
            <div className="space-y-3">
              {todayTasks.map(task => (
                <Card key={task.id} className={task.status === 'completed' ? 'opacity-75' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(task.type)}
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' ? 'Hög' : task.priority === 'medium' ? 'Mellan' : 'Låg'}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{task.leadName} ({task.leadKommun})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.dueTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{getTypeText(task.type)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => completeTask(task.id)} className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Klar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => cancelTask(task.id)}>
                              Avbryt
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Kommande uppföljningar
            </h2>
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(task.type)}
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' ? 'Hög' : task.priority === 'medium' ? 'Mellan' : 'Låg'}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{task.leadName} ({task.leadKommun})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString('sv-SE')} kl {task.dueTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{getTypeText(task.type)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => completeTask(task.id)} className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Klar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => cancelTask(task.id)}>
                              Avbryt
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Inga uppföljningar</h3>
              <p className="text-muted-foreground mb-4">
                {search || filter !== 'all' ? 'Inga uppgifter matchar din sökning.' : 'Börja med att lägga till din första uppföljning.'}
              </p>
              <Button onClick={() => setShowAddTask(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Lägg till uppföljning
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Ny uppföljning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Lead</label>
                  <Select value={newTask.leadId || "none"} onValueChange={(value: string) => setNewTask(prev => ({ ...prev, leadId: value === "none" ? "" : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj lead" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Välj lead</SelectItem>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} ({lead.kommun})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Typ</label>
                  <Select value={newTask.type} onValueChange={(value: FollowUpTask['type']) => setNewTask(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Telefonsamtal</SelectItem>
                      <SelectItem value="email">E-post</SelectItem>
                      <SelectItem value="meeting">Möte</SelectItem>
                      <SelectItem value="quote_followup">Offertuppföljning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Titel</label>
                <Input
                  placeholder="T.ex. Uppföljning efter offert"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Beskrivning</label>
                <Input
                  placeholder="Detaljer om vad som behöver göras..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Datum</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tid</label>
                  <Input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prioritet</label>
                  <Select value={newTask.priority} onValueChange={(value: FollowUpTask['priority']) => setNewTask(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Låg</SelectItem>
                      <SelectItem value="medium">Mellan</SelectItem>
                      <SelectItem value="high">Hög</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addTask} disabled={!newTask.leadId || !newTask.title}>
                  Lägg till
                </Button>
                <Button variant="outline" onClick={() => setShowAddTask(false)}>
                  Avbryt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
