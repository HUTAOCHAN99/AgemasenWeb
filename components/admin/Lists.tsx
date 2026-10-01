"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { DetailDrawer, type DetailKind, type DetailTarget } from "@/components/admin/DetailDrawer";
import { Avatar, Empty, Panel, Pill, SearchBox, td, th } from "@/components/admin/parts";

export type GroupRow = {
  id?: string;
  name: string;
  members: number;
  cmd7: number;
  cmdToday?: number;
  disabled?: boolean;
  pp?: string | null;
};

export type UserRow = {
  name?: string | null;
  number: string;
  count: number;
  cmdToday?: number;
  lastSeen?: string | number | null;
  blocked?: boolean;
  pp?: string | null;
};

type Toggled = (kind: DetailKind, id: string, disabled: boolean) => void;

export function GroupList({ groups, onToggled }: { groups: GroupRow[]; onToggled: Toggled }) {
  const { t } = useLanguage();
  const a = t.admin;
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<DetailTarget | null>(null);
  const fmt = (n: number) => n.toLocaleString(a.locale);
  const rows = groups.filter((g) => g.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <Panel title={a.groupsTitle} count={groups.length}>
      <SearchBox value={q} onChange={setQ} placeholder={a.searchGroups} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-ag-line">
              <th className={th}>{a.colGroup}</th>
              <th className={`${th} text-right`}>{a.colMembers}</th>
              <th className={`${th} text-right`}>{a.colCmdToday}</th>
              <th className={`${th} text-right`}>{a.colCmd7}</th>
              <th className={`${th} text-right`}>{a.colStatus}</th>
              <th className={th}>
                <span className="sr-only">{a.detail}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {rows.length ? (
              rows.map((g, i) => (
                <tr
                  key={`${g.id ?? g.name}-${i}`}
                  onClick={() =>
                    g.id &&
                    setSel({ kind: "group", id: g.id, name: g.name, pp: g.pp, disabled: !!g.disabled, members: g.members })
                  }
                  className={g.id ? "cursor-pointer transition-colors hover:bg-ag-fg/[0.04]" : ""}
                >
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <Avatar src={g.pp} name={g.name} alt={`${a.ppAlt}: ${g.name}`} />
                      <button type="button" className="min-w-0 truncate text-left font-bold">
                        {g.name}
                      </button>
                    </div>
                  </td>
                  <td className={`${td} text-right tabular-nums`}>{fmt(g.members)}</td>
                  <td className={`${td} text-right font-bold tabular-nums`}>{fmt(g.cmdToday ?? 0)}</td>
                  <td className={`${td} text-right tabular-nums text-ag-muted`}>{fmt(g.cmd7)}</td>
                  <td className={`${td} text-right`}>
                    <Pill tone={g.disabled ? "bad" : "ok"}>{g.disabled ? a.disabled : a.active}</Pill>
                  </td>
                  <td className={`${td} w-8 pl-0 text-ag-muted`}>
                    <ChevronRight className="size-4" aria-hidden />
                  </td>
                </tr>
              ))
            ) : (
              <Empty cols={6} text={groups.length ? a.noMatch : a.emptyGroups} />
            )}
          </tbody>
        </table>
      </div>
      <DetailDrawer
        target={sel}
        onClose={() => setSel(null)}
        onToggled={(k, id, d) => {
          onToggled(k, id, d);
        }}
      />
    </Panel>
  );
}

export function UserList({ users, onToggled }: { users: UserRow[]; onToggled: Toggled }) {
  const { t } = useLanguage();
  const a = t.admin;
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<DetailTarget | null>(null);
  const fmt = (n: number) => n.toLocaleString(a.locale);
  const when = (v?: string | number | null) =>
    v
      ? new Date(v).toLocaleString(a.locale, {
          timeZone: "Asia/Jakarta",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  const needle = q.trim().toLowerCase();
  const rows = users.filter(
    (u) => (u.name ?? "").toLowerCase().includes(needle) || u.number.includes(needle),
  );

  return (
    <Panel title={a.usersTitle} count={users.length}>
      <SearchBox value={q} onChange={setQ} placeholder={a.searchUsers} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-ag-line">
              <th className={th}>{a.colName}</th>
              <th className={`${th} text-right`}>{a.colCmdToday}</th>
              <th className={`${th} text-right`}>{a.colMsgCount}</th>
              <th className={`${th} text-right`}>{a.colLast}</th>
              <th className={`${th} text-right`}>{a.colStatus}</th>
              <th className={th}>
                <span className="sr-only">{a.detail}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {rows.length ? (
              rows.map((u, i) => {
                const name = u.name || `+${u.number}`;
                return (
                  <tr
                    key={`${u.number}-${i}`}
                    onClick={() =>
                      setSel({ kind: "user", id: u.number, name, pp: u.pp, disabled: !!u.blocked })
                    }
                    className="cursor-pointer transition-colors hover:bg-ag-fg/[0.04]"
                  >
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <Avatar src={u.pp} name={name} alt={`${a.ppAlt}: ${name}`} />
                        <div className="min-w-0 text-left">
                          <button type="button" className="block max-w-full truncate text-left font-bold">
                            {u.name || "-"}
                          </button>
                          <p className="font-mono text-[11px] tabular-nums text-ag-muted">
                            +{u.number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} text-right font-bold tabular-nums`}>{fmt(u.cmdToday ?? 0)}</td>
                    <td className={`${td} text-right tabular-nums text-ag-muted`}>{fmt(u.count)}</td>
                    <td className={`${td} text-right tabular-nums text-ag-muted`}>{when(u.lastSeen)}</td>
                    <td className={`${td} text-right`}>
                      <Pill tone={u.blocked ? "bad" : "ok"}>{u.blocked ? a.blocked : a.active}</Pill>
                    </td>
                    <td className={`${td} w-8 pl-0 text-ag-muted`}>
                      <ChevronRight className="size-4" aria-hidden />
                    </td>
                  </tr>
                );
              })
            ) : (
              <Empty cols={6} text={users.length ? a.noMatch : a.emptyUsers} />
            )}
          </tbody>
        </table>
      </div>
      <DetailDrawer
        target={sel}
        onClose={() => setSel(null)}
        onToggled={(k, id, d) => {
          onToggled(k, id, d);
        }}
      />
    </Panel>
  );
}
